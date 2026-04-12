package com.Backend.KrishiEaze.controller;

import com.Backend.KrishiEaze.dto.*;
import com.Backend.KrishiEaze.security.AuthService;
import com.Backend.KrishiEaze.security.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final CookieService cookieService;

    @PostMapping("/signup-request")
    public ResponseEntity<SignupResponseDto> signup(@RequestBody SignupRequestDto dto) {
        return ResponseEntity.ok(authService.initiateSignup(dto.getMobileNo()));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<LoginResponseDto> verify(@RequestBody LoginRequestDto dto,HttpServletResponse response) {
        LoginResponseDto loginResponse = authService.finalizeLogin(dto);
        //int maxAge = 86400;

        cookieService.attachRefreshCookie(
                response,
                loginResponse.getTokenResponse().refreshToken()
        );

        // 3. Optional: Add the no-store headers for security
        cookieService.addNoStoreHeaders(response);


        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponseDto> refreshToken(HttpServletRequest request) {

        // 1. Extract token from Cookie using your Service
        String refreshToken = cookieService.getRefreshTokenFromCookie(request);

        if (refreshToken == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponseDto.of("Refresh token missing", false));
        }

        try {
            // 2. Get new tokens
            TokenResponse tokens = authService.refreshAccessToken(refreshToken);

            // 3. Return only the new Access Token in the JSON body
            return ResponseEntity.ok(ApiResponseDto.of("Token refreshed", true, tokens));

        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(ApiResponseDto.of("Session expired, please login again", false));
        }
    }
}
