package com.welfare.check.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PostRequest {
    @NotNull
    private Integer boardId;
    @NotBlank @Size(max = 200)
    private String title;
    @NotBlank
    private String content;
}
