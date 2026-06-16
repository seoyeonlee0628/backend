package com.welfare.check.controller;

import com.welfare.check.dto.*;
import com.welfare.check.service.DiagnosisService;
import com.welfare.check.service.LocalModelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diagnosis")
@RequiredArgsConstructor
public class DiagnosisController {

    private final DiagnosisService diagnosisService;
    private final LocalModelService localModelService;

    // 복지 진단
    @PostMapping
    public ResponseEntity<?> diagnose(
            @Valid @RequestBody DiagnosisRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails != null ? userDetails.getUsername() : null;
            DiagnosisResult result = diagnosisService.diagnose(request, username);
            return ResponseEntity.ok(Map.of("success", true, "result", result));
        } catch (IllegalArgumentException e) {
            // 클라이언트 오류 (잘못된 입력) → 400
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            // AI 서버 오류 등 → 503 (클라이언트 잘못 아님)
            return ResponseEntity.status(503).body(Map.of("success", false,
                "message", e.getMessage() != null ? e.getMessage() : "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."));
        }
    }

    // 진단 히스토리
    @GetMapping("/history")
    public ResponseEntity<List<DiagnosisResult>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(diagnosisService.getHistory(userDetails.getUsername()));
    }

    // 로드맵 생성
    @PostMapping("/roadmap")
    public ResponseEntity<?> generateRoadmap(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String roadmapJson = localModelService.generateRoadmap(
                body.getOrDefault("job", "개발자"),
                body.getOrDefault("period", "6개월"),
                body.getOrDefault("input", "")
            );
            return ResponseEntity.ok(Map.of("success", true, "roadmap", roadmapJson));
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
