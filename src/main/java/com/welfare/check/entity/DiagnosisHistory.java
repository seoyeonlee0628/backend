package com.welfare.check.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis_history")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiagnosisHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String inputText;

    @Column(columnDefinition = "TEXT")
    private String resultJson;

    @Column(name = "benefit_count")
    private Integer benefitCount;

    @Column(name = "total_amount", length = 100)
    private String totalAmount;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
