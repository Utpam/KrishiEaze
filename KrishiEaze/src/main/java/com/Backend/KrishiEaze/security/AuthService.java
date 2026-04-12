package com.Backend.KrishiEaze.security;

import com.Backend.KrishiEaze.dto.*;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.repositories.UserRepository;
import com.Backend.KrishiEaze.services.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final OtpService otpService;
    private final UserRepository userRepository;

    /**
     * Phase 1: OTP Generation
     * Validates mobile number and saves a 6-digit OTP via OtpService.
     */
    public SignupResponseDto initiateSignup(String mobileNo) {
        if (mobileNo == null || mobileNo.length() != 10) {
            throw new IllegalArgumentException("Enter Valid 10-Digit Mobile Number");
        }

        // Generate a secure 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));

        // Save to your specialized OtpService (which likely handles expiry)
        otpService.saveOtp(mobileNo, otp);
        System.out.println("<<<< DEVELOPMENT ONLY >>>> OTP for " + mobileNo + " is: " + otp);

        SignupResponseDto response = new SignupResponseDto();
        response.setMobileNo(mobileNo);
        response.setOtp(otp); // Returning OTP in response for development/testing
        response.setMessage("OTP generated successfully");
        return response;
    }

    /**
     * Phase 2: OTP Verification & JWT Issuance
     * Uses CustomAuthenticationProvider to verify credentials.
     */
    public LoginResponseDto finalizeLogin(LoginRequestDto dto) {
        // 1. Trigger the CustomAuthenticationProvider using our Unauthenticated Token
        Authentication auth = authManager.authenticate(
                new CustomAuthenticationToken(dto.getMobileNo(), dto.getOtp())
        );

        // 2. Extract the Authenticated User entity from the principal
        User authenticatedUser = (User) auth.getPrincipal();

        //  Generate a unique ID (jti) for this specific login session
        String jti = UUID.randomUUID().toString();

        // 3. Generate the new TokenResponse record
        // Assuming your jwtService now has methods for both Access and Refresh tokens
        String accessToken = jwtService.generateJwtToken(authenticatedUser,jti);
        String refreshToken = jwtService.generateRefreshToken(authenticatedUser,jti);
        long expiresIn = jwtService.getExpirationTime();

        TokenResponse tokenData = TokenResponse.of(accessToken, refreshToken, expiresIn);

        // 4. Build the final LoginResponse
        LoginResponseDto response = new LoginResponseDto();
        response.setTokenResponse(tokenData); // Use the new Record here
        response.setId(Math.toIntExact(authenticatedUser.getId()));
        response.setMobileNo(authenticatedUser.getMobileNo());
        response.setMessage("Login Successful");

        // Logic: If profile is NOT completed, they are considered a "New User"
        // and should be redirected to the Profile Setup screen in the app.
        response.setNewUser(!authenticatedUser.isProfileCompleted());

        return response;
    }

    public TokenResponse refreshAccessToken(String refreshToken) {
        // 1. Validate token
        if (!jwtService.validateToken(refreshToken) || !jwtService.isRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        // 2. Extract mobile number
        String mobileNo = jwtService.extractMobileNo(refreshToken);

        // 3. Find user in DB
        User user = userRepository.findByMobileNo(mobileNo)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnable()) {
            throw new RuntimeException("User account is disabled");
        }

        // 4. Generate a new Access Token
        String jti = UUID.randomUUID().toString();
        String newAccessToken = jwtService.generateJwtToken(user, jti);

        // Return the pair (Reuse old refresh token or rotate)
        return new TokenResponse(newAccessToken, refreshToken, jwtService.getExpirationTime(),"access");
    }
}