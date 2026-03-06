package com.Backend.KrishiEaze.security;

import com.Backend.KrishiEaze.dto.LoginRequestDto;
import com.Backend.KrishiEaze.dto.LoginResponseDto;
import com.Backend.KrishiEaze.dto.SignupRequestDto;
import com.Backend.KrishiEaze.dto.SignupResponseDto;
import com.Backend.KrishiEaze.entities.User;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;

    public SignupResponseDto initiateSignup(String mobileNo) {
        if (mobileNo == null || mobileNo.length() != 10) {
            throw new IllegalArgumentException("Enter Valid 10-Digit Mobile Number");
        }
            // Generate random 6 digits
            String otp = String.format("%06d", new Random().nextInt(999999));

        // Return OTP in JSON as requested
        SignupResponseDto response = new SignupResponseDto();
        response.setMobileNo(mobileNo);
        response.setOtp(otp);
        response.setMessage("OTP generated successfully");
        return response;
    }

    public LoginResponseDto finalizeLogin(LoginRequestDto dto) {
        // This triggers the MobileAuthenticationProvider
        Authentication auth = authManager.authenticate(
                new CustomAuthenticationToken(dto.getMobileNo(), dto.getOtp())
        );
        // After authentication, the principal is our User entity
        User authenticatedUser = (User) auth.getPrincipal();
        // Generate JWT Token
        String token = jwtUtils.generateToken(dto.getMobileNo());

        LoginResponseDto response = new LoginResponseDto();
        response.setJwt(token);
        response.setMobileNo(dto.getMobileNo());
        response.setMessage("Login Successful");
        return response;
    }
}
