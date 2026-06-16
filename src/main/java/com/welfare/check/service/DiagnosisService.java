package com.welfare.check.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.welfare.check.dto.DiagnosisRequest;
import com.welfare.check.dto.DiagnosisResult;
import com.welfare.check.entity.DiagnosisHistory;
import com.welfare.check.entity.User;
import com.welfare.check.repository.DiagnosisHistoryRepository;
import com.welfare.check.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DiagnosisService {

    private final LocalModelService localModelService;
    private final WelfareApiService welfareApiService;
    private final DiagnosisHistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public DiagnosisResult diagnose(DiagnosisRequest request, String username) {
        // 1. 학습된 로컬 모델로 분석 (서비스 목록은 모델 서버 내부에서 API 호출)
        String aiResponse = localModelService.analyze(request.getInput());

        // 3. JSON 파싱 (GeminiService에서 이미 JSON 추출 완료)
        DiagnosisResult result;
        try {
            result = objectMapper.readValue(aiResponse, DiagnosisResult.class);
        } catch (Exception e) {
            log.error("AI 응답 파싱 실패: {}", aiResponse);
            throw new RuntimeException("AI 응답을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.");
        }

        // 4. 히스토리 저장
        if (username != null) {
            userRepository.findByUsername(username).ifPresent(user -> {
                DiagnosisHistory history = DiagnosisHistory.builder()
                    .user(user)
                    .inputText(request.getInput())
                    .resultJson(aiResponse)
                    .benefitCount(result.getCount())
                    .totalAmount(result.getAmount())
                    .build();
                historyRepository.save(history);
            });
        }

        return result;
    }

    public List<DiagnosisResult> getHistory(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        return historyRepository.findTop5ByUserOrderByCreatedAtDesc(user)
            .stream()
            .map(h -> {
                try {
                    return objectMapper.readValue(h.getResultJson(), DiagnosisResult.class);
                } catch (Exception e) {
                    return null;
                }
            })
            .filter(r -> r != null)
            .collect(Collectors.toList());
    }
}
