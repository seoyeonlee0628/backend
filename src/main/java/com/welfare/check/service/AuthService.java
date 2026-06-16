package com.welfare.check.service;

import com.welfare.check.dto.RegisterRequest;
import com.welfare.check.dto.UserDto;
import com.welfare.check.entity.User;
import com.welfare.check.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /** 중복 체크 API용: field = "username" | "nickname" | "email" */
    public boolean isAvailable(String field, String value) {
        return switch (field) {
            case "username" -> !userRepository.existsByUsername(value);
            case "nickname" -> !userRepository.existsByNickname(value);
            case "email"    -> !userRepository.existsByEmail(value);
            default         -> true;
        };
    }

    @Transactional
    public UserDto register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        User user = User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .nickname(request.getNickname())
            .email(request.getEmail())
            .role(User.Role.USER)
            .build();

        User saved = userRepository.save(user);
        return UserDto.from(saved);
    }

    public UserDto getUserInfo(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        return UserDto.from(user);
    }

    @Transactional
    public UserDto updateNickname(String username, String newNickname) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        user.setNickname(newNickname);
        return UserDto.from(userRepository.save(user));
    }

    @Transactional
    public void updatePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
