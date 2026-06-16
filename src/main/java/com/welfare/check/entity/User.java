package com.welfare.check.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(nullable = false, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.USER;

    @Column
    @Builder.Default
    private boolean banned = false;

    @Column
    private Integer age;

    @Column(length = 50)
    private String region;

    @Column(name = "monthly_income")
    private Integer monthlyIncome; // 만원 단위

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private int points = 0;

    @Column(nullable = false)
    @Builder.Default
    private int streak = 0;

    @Column(name = "last_check_in")
    private java.time.LocalDate lastCheckIn;

    @Column(length = 500)
    @Builder.Default
    private String badges = "";

    @Column(name = "nickname_emoji", length = 10)
    @Builder.Default
    private String nicknameEmoji = "";

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Post> posts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<WishItem> wishItems;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<DiagnosisHistory> diagnosisHistories;

    public enum Role {
        USER, ADMIN
    }
}
