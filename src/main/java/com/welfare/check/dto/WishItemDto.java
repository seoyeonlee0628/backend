package com.welfare.check.dto;

import com.welfare.check.entity.WishItem;
import lombok.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class WishItemDto {
    private Long id;
    private String name;
    private String amount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String applyUrl;
    private String applicationStatus;
    private Long dDay; // 마감까지 남은 일수. 지났으면 음수

    public static WishItemDto from(WishItem item) {
        Long dDay = null;
        if (item.getEndDate() != null) {
            dDay = ChronoUnit.DAYS.between(LocalDate.now(), item.getEndDate());
        }
        return WishItemDto.builder()
            .id(item.getId())
            .name(item.getName())
            .amount(item.getAmount())
            .startDate(item.getStartDate())
            .endDate(item.getEndDate())
            .applyUrl(item.getApplyUrl())
            .applicationStatus(item.getApplicationStatus())
            .dDay(dDay)
            .build();
    }
}
