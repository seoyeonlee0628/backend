package com.welfare.check.dto;

import com.welfare.check.entity.User;
import lombok.*;
import java.util.List;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String nickname;
    private String email;
    private String role;
    private Integer age;
    private String region;
    private Integer monthlyIncome;
    private int points;
    private int streak;
    private java.util.List<String> badges;
    private String nicknameEmoji;

    public static UserDto from(User user) {
        return UserDto.builder()
            .id(user.getId())
            .username(user.getUsername())
            .nickname(user.getNickname())
            .email(user.getEmail())
            .role(user.getRole().name())
            .age(user.getAge())
            .region(user.getRegion())
            .monthlyIncome(user.getMonthlyIncome())
            .points(user.getPoints())
            .streak(user.getStreak())
            .badges(user.getBadges() == null || user.getBadges().isBlank()
                ? new java.util.ArrayList<>()
                : java.util.Arrays.asList(user.getBadges().split(",")))
            .nicknameEmoji(user.getNicknameEmoji() == null ? "" : user.getNicknameEmoji())
            .build();
    }
}
