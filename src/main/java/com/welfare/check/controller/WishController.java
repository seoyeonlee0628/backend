package com.welfare.check.controller;

import com.welfare.check.dto.*;
import com.welfare.check.service.WelfareDeadlineScraperService;
import com.welfare.check.service.WishService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wish")
@RequiredArgsConstructor
public class WishController {

    private final WishService wishService;
    private final WelfareDeadlineScraperService scraperService;

    @GetMapping
    public ResponseEntity<List<WishItemDto>> getWishList(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(wishService.getWishList(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<?> addWish(
            @Valid @RequestBody WishItemRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            WishItemDto item = wishService.addWish(request, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("success", true, "item", item));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeWish(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            wishService.removeWish(id, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            WishItemDto item = wishService.updateStatus(id, body.get("status"), userDetails.getUsername());
            return ResponseEntity.ok(Map.of("success", true, "item", item));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/deadline-soon")
    public ResponseEntity<List<WishItemDto>> getDeadlineSoon(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(wishService.getDeadlineSoon(userDetails.getUsername()));
    }

    // 마감일 자동 스크래핑
    @PostMapping("/{id}/scrape-deadline")
    public ResponseEntity<?> scrapeDeadline(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            WishItemDto item = wishService.scrapeAndUpdateDeadline(id, userDetails.getUsername(), scraperService);
            String message = item.getEndDate() != null ? "마감일을 찾았어요: " + item.getEndDate() : "마감일 정보를 찾지 못했어요";
            return ResponseEntity.ok(Map.of("success", true, "item", item, "message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
