package com.welfare.check.controller;

import com.welfare.check.dto.*;
import com.welfare.check.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 게시글 목록
    @GetMapping
    public ResponseEntity<Page<PostDto>> getPosts(
            @RequestParam(defaultValue = "1") int boardId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(postService.getPosts(boardId, page, size));
    }

    // 게시글 상세
    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    // 게시글 작성
    @PostMapping
    public ResponseEntity<?> createPost(
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            PostDto post = postService.createPost(request, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("success", true, "post", post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            PostDto post = postService.updatePost(id, request, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("success", true, "post", post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            postService.deletePost(id, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 좋아요 토글
    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            var result = postService.toggleLike(id, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("success", true, "liked", result.get("liked"), "likeCount", result.get("likeCount")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 북마크 토글
    @PostMapping("/{id}/bookmark")
    public ResponseEntity<?> toggleBookmark(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            boolean bookmarked = postService.toggleBookmark(id, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("success", true, "bookmarked", bookmarked));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 인기글
    @GetMapping("/popular")
    public ResponseEntity<List<PostDto>> getPopular() {
        return ResponseEntity.ok(postService.getPopularPosts());
    }

    // 내가 쓴 글
    @GetMapping("/my")
    public ResponseEntity<List<PostDto>> getMyPosts(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.getMyPosts(userDetails.getUsername()));
    }

    // 좋아요한 글
    @GetMapping("/liked")
    public ResponseEntity<List<PostDto>> getLikedPosts(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.getLikedPosts(userDetails.getUsername()));
    }

    // 북마크한 글
    @GetMapping("/bookmarked")
    public ResponseEntity<List<PostDto>> getBookmarkedPosts(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.getBookmarkedPosts(userDetails.getUsername()));
    }

    // 게시글 부스트
    @PostMapping("/{id}/boost")
    public ResponseEntity<?> boostPost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).body(Map.of("success", false, "message", "로그인이 필요합니다."));
        try {
            return ResponseEntity.ok(postService.boostPost(id, userDetails.getUsername()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
