package com.welfare.check.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "wish_items")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 100)
    private String amount;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "apply_url", length = 500)
    private String applyUrl;

    @Column(name = "application_status", length = 20)
    @Builder.Default
    private String applicationStatus = "INTERESTED"; // INTERESTED, APPLIED, RECEIVED

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
