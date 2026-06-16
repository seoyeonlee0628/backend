package com.welfare.check.controller;

import com.welfare.check.dto.*;
import com.welfare.check.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            UserDto user = authService.register(request);
            return ResponseEntity.ok(Map.of("success", true, "user", user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 중복 체크 (회원가입 시 실시간 확인)
    @GetMapping("/check")
    public ResponseEntity<?> checkDuplicate(
            @RequestParam String field,
            @RequestParam String value) {
        if (value == null || value.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("available", false, "message", "값을 입력해주세요"));
        }
        boolean available = authService.isAvailable(field, value);
        return ResponseEntity.ok(Map.of("available", available));
    }

    // 현재 로그인 유저 정보
    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.ok(Map.of("loggedIn", false));
        }
        UserDto user = authService.getUserInfo(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("loggedIn", true, "user", user));
    }

    // 닉네임 변경
    @PutMapping("/nickname")
    public ResponseEntity<?> updateNickname(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        try {
            UserDto user = authService.updateNickname(userDetails.getUsername(), body.get("nickname"));
            return ResponseEntity.ok(Map.of("success", true, "user", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 비밀번호 변경
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        try {
            authService.updatePassword(
                userDetails.getUsername(),
                body.get("currentPassword"),
                body.get("newPassword")
            );
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
