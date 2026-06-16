package com.welfare.check.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocalModelService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    private static final String MODEL_URL = "http://localhost:8000/predict";

    private static final String ROADMAP_URL = "http://localhost:8000/roadmap";

    public String analyze(String userInput) {
        try {
            return webClient.post()
                .uri(MODEL_URL)
                .header("Content-Type", "application/json")
                .bodyValue(Map.of("input", userInput))
                .retrieve()
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(30));
        } catch (Exception e) {
            log.error("로컬 모델 호출 실패: {}", e.getMessage());
            throw new RuntimeException("AI 분석 서버에 연결할 수 없습니다. python server.py가 실행 중인지 확인하세요.");
        }
    }

    public String generateRoadmap(String job, String period, String userInput) {
        try {
            return webClient.post()
                .uri(ROADMAP_URL)
                .header("Content-Type", "application/json")
                .bodyValue(Map.of("job", job, "period", period, "input", userInput))
                .retrieve()
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(30));
        } catch (Exception e) {
            log.error("로드맵 생성 실패: {}", e.getMessage());
            throw new RuntimeException("AI 분석 서버에 연결할 수 없습니다. python server.py가 실행 중인지 확인하세요.");
        }
    }
}
