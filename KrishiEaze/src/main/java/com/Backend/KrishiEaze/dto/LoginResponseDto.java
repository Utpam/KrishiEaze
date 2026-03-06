package com.Backend.KrishiEaze.dto;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Data
@RequiredArgsConstructor
@Getter
@Setter

public class LoginResponseDto {
    private Long id;
    private String jwt;
    private String otp;
    private String mobileNo;
    private String message;
}
