package com.welfare.check.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RegisterRequest {
    @NotBlank @Size(min = 4, max = 20)
    private String username;
    @NotBlank @Size(min = 4, max = 20)
    private String password;
    @NotBlank @Size(min = 2, max = 20)
    private String nickname;
    @NotBlank @Email
    private String email;
}
