package com.Backend.KrishiEaze.security;

import com.Backend.KrishiEaze.dto.LoginRequestDto;
import com.Backend.KrishiEaze.dto.LoginResponseDto;
import com.Backend.KrishiEaze.dto.SignupResponseDto;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.services.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final OtpService otpService; // Inject new service


    public SignupResponseDto initiateSignup(String mobileNo) {
        if (mobileNo == null || mobileNo.length() != 10) {
            throw new IllegalArgumentException("Enter Valid 10-Digit Mobile Number");
        }
            // Generate random 6 digits
        String otp = String.format("%06d", new Random().nextInt(999999));

        otpService.saveOtp(mobileNo, otp);

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
        String token = jwtService.generateJwtToken(authenticatedUser);

        LoginResponseDto response = new LoginResponseDto();
        response.setJwt(token);
        response.setId(Math.toIntExact(authenticatedUser.getId()));
        response.setMobileNo(authenticatedUser.getMobileNo());
        response.setMessage("Login Successful");
        // If profileCompleted is false, then isNewUser is true
        response.setNewUser(!authenticatedUser.isProfileCompleted());
        return response;
    }
}
