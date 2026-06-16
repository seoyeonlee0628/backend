package com.welfare.check.config;

import com.welfare.check.entity.User;
import com.welfare.check.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.initial-password}")
    private String adminInitialPassword;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode(adminInitialPassword))
                .nickname("관리자")
                .email("admin@welfare-check.com")
                .role(User.Role.ADMIN)
                .build();
            userRepository.save(admin);
            log.info("Admin 계정 생성 완료");
        }
    }
}
