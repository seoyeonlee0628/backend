package com.welfare.check.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DiagnosisResult {
    private String parse;
    private int count;
    private String amount;
    private String deadline;
    private List<ServiceItem> services;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ServiceItem {
        private String name;
        private String amt;
        private String period;
        private String deadline;
        private String url;
        private String reason;
    }
}
