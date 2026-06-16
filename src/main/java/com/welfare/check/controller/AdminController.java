package com.welfare.check.controller;

import com.welfare.check.dto.UserDto;
import com.welfare.check.entity.User;
import com.welfare.check.repository.PostRepository;
import com.welfare.check.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    // 전체 회원 목록
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getUsers() {
        return ResponseEntity.ok(
            userRepository.findAll().stream()
                .map(UserDto::from).collect(Collectors.toList())
        );
    }

    // 회원 정지/해제
    @PutMapping("/users/{id}/ban")
    public ResponseEntity<?> toggleBan(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        if (user.getRole() == User.Role.ADMIN) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "관리자는 정지할 수 없습니다."));
        }
        user.setBanned(!user.isBanned());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true, "banned", user.isBanned()));
    }

    // 게시글 고정/해제
    @PutMapping("/posts/{id}/pin")
    public ResponseEntity<?> togglePin(@PathVariable Long id) {
        return postRepository.findById(id).map(post -> {
            post.setPinned(!post.isPinned());
            postRepository.save(post);
            return ResponseEntity.ok(Map.of("success", true, "pinned", post.isPinned()));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 게시글 강제 삭제
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        postRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    // 통계
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
            "totalUsers", userRepository.count(),
            "totalPosts", postRepository.count()
        ));
    }
}
