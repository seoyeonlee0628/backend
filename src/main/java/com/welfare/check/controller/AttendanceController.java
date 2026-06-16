package com.welfare.check.controller;

import com.welfare.check.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check")
    public ResponseEntity<?> checkIn(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).body(Map.of("success", false));
        return ResponseEntity.ok(attendanceService.checkIn(userDetails.getUsername()));
    }

    @GetMapping("/status")
    public ResponseEntity<?> status(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).body(Map.of("success", false));
        return ResponseEntity.ok(attendanceService.getStatus(userDetails.getUsername()));
    }

    @PostMapping("/badge/buy")
    public ResponseEntity<?> buyBadge(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        if (userDetails == null) return ResponseEntity.status(401).body(Map.of("success", false));
        return ResponseEntity.ok(attendanceService.buyBadge(userDetails.getUsername(), body.get("badge")));
    }

    @PostMapping("/roadmap/unlock")
    public ResponseEntity<?> unlockRoadmap(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        if (userDetails == null) return ResponseEntity.status(401).body(Map.of("success", false));
        return ResponseEntity.ok(attendanceService.unlockRoadmap(userDetails.getUsername(), body.get("job")));
    }

    @PostMapping("/emoji/equip")
    public ResponseEntity<?> equipEmoji(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        if (userDetails == null) return ResponseEntity.status(401).body(Map.of("success", false));
        return ResponseEntity.ok(attendanceService.equipEmoji(userDetails.getUsername(), body.getOrDefault("emoji", "")));
    }

    @PostMapping("/emoji/buy")
    public ResponseEntity<?> buyEmoji(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        if (userDetails == null) return ResponseEntity.status(401).body(Map.of("success", false));
        return ResponseEntity.ok(attendanceService.buyEmoji(userDetails.getUsername(), body.get("emoji")));
    }
}
