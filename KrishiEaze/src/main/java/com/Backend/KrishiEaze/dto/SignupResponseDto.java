package com.Backend.KrishiEaze.dto;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@RequiredArgsConstructor
public class SignupResponseDto {
    private int id;
    private String mobileNo;
    private String otp;
    private String message;
}
