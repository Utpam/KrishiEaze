package com.Backend.KrishiEaze.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class LoginRequestDto {
    private String mobileNo;
    private String otp;
}
