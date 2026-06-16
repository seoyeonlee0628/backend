package com.welfare.check.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class WishItemRequest {
    @NotBlank
    private String name;
    private String amount;
    private String startDate;   // String으로 받아 서비스에서 안전하게 파싱
    private String endDate;     // "확인 필요", "상시" 등 비날짜 문자열 허용
    private String applyUrl;
    private String applicationStatus; // INTERESTED, APPLIED, RECEIVED
}
