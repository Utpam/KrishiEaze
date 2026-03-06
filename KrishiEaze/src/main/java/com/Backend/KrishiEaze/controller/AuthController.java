package com.Backend.KrishiEaze.controller;

import com.Backend.KrishiEaze.dto.LoginRequestDto;
import com.Backend.KrishiEaze.dto.LoginResponseDto;
import com.Backend.KrishiEaze.dto.SignupRequestDto;
import com.Backend.KrishiEaze.dto.SignupResponseDto;
import com.Backend.KrishiEaze.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup-request")
    public ResponseEntity<SignupResponseDto> signup(@RequestBody SignupRequestDto dto) {
        return ResponseEntity.ok(authService.initiateSignup(dto.getMobileNo()));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<LoginResponseDto> verify(@RequestBody LoginRequestDto dto) {
        return ResponseEntity.ok(authService.finalizeLogin(dto));
    }
}
