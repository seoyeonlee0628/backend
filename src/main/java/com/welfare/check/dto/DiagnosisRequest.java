package com.welfare.check.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DiagnosisRequest {
    @NotBlank
    private String input;
}
