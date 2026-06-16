package com.welfare.check.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.api-url}")
    private String apiUrl;

    @Value("${gemini.fallback-url}")
    private String fallbackUrl;

    @Value("${gemini.fallback2-url}")
    private String fallback2Url;

    public String analyzeDiagnosis(String userInput, String welfareList) {
        String prompt = buildPrompt(userInput, welfareList);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
            Map.of("parts", List.of(Map.of("text", prompt)))
        ));
        requestBody.put("generationConfig", Map.of(
            "temperature", 0.5,
            "maxOutputTokens", 8192
        ));

        // 1차: gemini-2.5-flash → 실패 시 2.0-flash → 실패 시 2.0-flash-lite
        try {
            return callGemini(apiUrl, requestBody);
        } catch (Exception e) {
            log.warn("기본 모델(2.5-flash) 실패, 폴백1(2.0-flash)로 재시도: {}", e.getMessage());
            try {
                return callGemini(fallbackUrl, requestBody);
            } catch (Exception fe) {
                log.warn("폴백1(2.0-flash) 실패, 폴백2(2.0-flash-lite)로 재시도: {}", fe.getMessage());
                try {
                    return callGemini(fallback2Url, requestBody);
                } catch (Exception fe2) {
                    log.error("폴백2(2.0-flash-lite)도 실패", fe2);
                    throw new RuntimeException("AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                }
            }
        }
    }

    /** 공통 Gemini 호출 (retry 2회 포함) */
    private String callGemini(String url, Map<String, Object> requestBody) {
        String response = webClient.post()
            .uri(url + "?key=" + apiKey)
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(String.class)
            .retryWhen(Retry.backoff(2, Duration.ofSeconds(5))
                .filter(e -> e instanceof WebClientResponseException webEx
                    && (webEx.getStatusCode().is5xxServerError()
                        || webEx.getStatusCode().value() == 429))
                .doBeforeRetry(sig -> log.warn("Gemini 재시도 #{}: {}",
                    sig.totalRetries() + 1, sig.failure().getMessage())))
            .block(Duration.ofSeconds(60));

        try {
            JsonNode root = objectMapper.readTree(response);
            String text = root.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();
            return extractJson(text);
        } catch (Exception e) {
            throw new RuntimeException("Gemini 응답 파싱 실패: " + e.getMessage());
        }
    }

    public String generateRoadmap(String job, String period, String userInput) {
        String prompt = buildRoadmapPrompt(job, period, userInput);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
            Map.of("parts", List.of(Map.of("text", prompt)))
        ));
        requestBody.put("generationConfig", Map.of(
            "temperature", 0.5,
            "maxOutputTokens", 8192
        ));

        try {
            return callGemini(apiUrl, requestBody);
        } catch (Exception e) {
            log.warn("기본 모델 로드맵 실패, 폴백1 시도: {}", e.getMessage());
            try {
                return callGemini(fallbackUrl, requestBody);
            } catch (Exception fe) {
                log.warn("폴백1 로드맵 실패, 폴백2 시도: {}", fe.getMessage());
                try {
                    return callGemini(fallback2Url, requestBody);
                } catch (Exception fe2) {
                    log.error("Gemini API 로드맵 생성 전체 실패", fe2);
                    throw new RuntimeException("로드맵 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                }
            }
        }
    }

    private String extractJson(String text) {
        // ```json ... ``` 마크다운 코드블록 제거
        text = text.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
        // JSON 객체 범위 추출
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start >= 0 && end > start) {
            String json = text.substring(start, end + 1);
            // JSON이 services 배열 중간에 잘린 경우 복구 시도
            if (!isBalanced(json)) {
                json = repairJson(json);
            }
            return json;
        }
        return text;
    }

    /** 중괄호/대괄호 균형 확인 */
    private boolean isBalanced(String json) {
        int braces = 0, brackets = 0;
        boolean inString = false;
        char prev = 0;
        for (char c : json.toCharArray()) {
            if (c == '"' && prev != '\\') inString = !inString;
            if (!inString) {
                if (c == '{') braces++;
                else if (c == '}') braces--;
                else if (c == '[') brackets++;
                else if (c == ']') brackets--;
            }
            prev = c;
        }
        return braces == 0 && brackets == 0;
    }

    /** 잘린 JSON 복구: 열린 배열/객체를 닫아줌 */
    private String repairJson(String json) {
        // 불완전한 마지막 서비스 항목 제거 (마지막 완전한 } 까지만 살림)
        int lastComplete = json.lastIndexOf("},");
        if (lastComplete < 0) lastComplete = json.lastIndexOf('}');
        if (lastComplete > 0) {
            json = json.substring(0, lastComplete + 1);
        }
        // 닫히지 않은 배열/객체 닫기
        StringBuilder sb = new StringBuilder(json);
        int braces = 0, brackets = 0;
        boolean inString = false;
        char prev = 0;
        for (char c : json.toCharArray()) {
            if (c == '"' && prev != '\\') inString = !inString;
            if (!inString) {
                if (c == '{') braces++;
                else if (c == '}') braces--;
                else if (c == '[') brackets++;
                else if (c == ']') brackets--;
            }
            prev = c;
        }
        while (brackets > 0) { sb.append(']'); brackets--; }
        while (braces > 0) { sb.append('}'); braces--; }
        return sb.toString();
    }

    private String buildPrompt(String userInput, String welfareList) {
        return """
            당신은 한국 복지 혜택 전문가입니다. 취업준비생이 놓치기 쉬운 복지 혜택을 적극적으로 발굴해주는 역할을 합니다.

            사용자 상황: %s

            아래 복지 서비스 목록을 참고해 분석하세요.
            각 항목은 "- 서비스명 [url:신청URL]: 설명" 형식입니다.
            %s

            분석 지침 (매우 중요):
            1. 사용자가 명시하지 않은 조건도 문맥에서 합리적으로 추론하세요.
               예) "구직 중" → 미취업 상태로 간주, "부모님이랑 삼" → 동거 가구로 간주.
            2. 확실히 해당되는 서비스뿐 아니라, 신청 가능성이 있는 서비스도 포함하세요 (3~7개 권장).
            3. amt는 "정보 없음"이 아닌 실제 금액 또는 "최대 OO만원" 등 구체적 수치로 채우세요.
            4. deadline은 "상시" 또는 알 수 없을 경우 "확인 필요"로 쓰세요. "정보 없음" 사용 금지.
            5. url 필드는 목록에서 제공된 [url:...] 값을 그대로 사용하세요. 없으면 "https://www.bokjiro.go.kr" 사용.
            6. amount(전체 연간 최대 수혜액)는 선택된 서비스들을 더해 "최대 OOOO만원" 형식으로 계산하세요.
            7. reason에는 이 사용자 상황과 해당 혜택이 연결되는 이유를 1~2줄로 구체적으로 설명하세요.

            반드시 아래 JSON 형식으로만 응답하세요. 설명 텍스트 없이 JSON만 출력하세요:
            {
              "parse": "사용자 상황 요약 1~2문장 (구직 상태, 가구 형태, 소득 수준 포함)",
              "count": 5,
              "amount": "최대 3000만원",
              "deadline": "상시",
              "services": [
                {
                  "name": "서비스명",
                  "amt": "월 50만원",
                  "period": "상시",
                  "deadline": "상시",
                  "url": "https://www.bokjiro.go.kr",
                  "reason": "미취업 청년으로서 구직 촉진을 위한 소득 지원 대상에 해당됩니다."
                }
              ]
            }
            """.formatted(userInput, welfareList);
    }

    private int parsePeriodMonths(String period) {
        if (period == null) return 6;
        return switch (period.replaceAll("\\s", "")) {
            case "3개월" -> 3;
            case "6개월" -> 6;
            case "1년", "12개월" -> 12;
            default -> {
                // "N개월" 형식 동적 파싱
                try { yield Integer.parseInt(period.replaceAll("[^0-9]", "")); }
                catch (NumberFormatException e) { yield 6; }
            }
        };
    }

    private String buildRoadmapPrompt(String job, String period, String userInput) {
        int months = parsePeriodMonths(period);
        return """
            당신은 취업 전문 컨설턴트입니다.

            목표 직군: %s
            기간: %s (%d개월)
            현재 상황: %s

            반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요:
            {
              "months": [
                {
                  "month": 1,
                  "title": "단계명",
                  "income": "이 시기 받을 수 있는 복지 혜택",
                  "color": "#06b6d4",
                  "checkpoint": "이달의 목표",
                  "tasks": [
                    {
                      "category": "학습",
                      "items": ["할 일1", "할 일2"]
                    }
                  ]
                }
              ]
            }
            """.formatted(job, period, months, userInput);
    }
}
