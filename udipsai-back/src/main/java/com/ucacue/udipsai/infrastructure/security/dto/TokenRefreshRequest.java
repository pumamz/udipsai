package com.ucacue.udipsai.infrastructure.security.dto;

import lombok.Data;

@Data
public class TokenRefreshRequest {
    private String refreshToken;
}
