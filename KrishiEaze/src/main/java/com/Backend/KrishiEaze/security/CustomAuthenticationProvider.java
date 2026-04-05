package com.Backend.KrishiEaze.security;

import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.repositories.UserRepository;
import com.Backend.KrishiEaze.services.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OtpService otpService;
    // Note: In a real app, verify OTP against Redis/Database

    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {

        //typecasting the Object class into String class.
        String mobile = (String) auth.getPrincipal();
        String otp = (String) auth.getCredentials();

        // FIX: Check if this specific OTP belongs to this specific mobile number


        if (!otpService.isOtpValid(mobile, otp)) {
            throw new BadCredentialsException("Invalid OTP for this mobile number");
        }
        // 1. Logic: Verify if OTP is valid (mock logic for now)
        if (otp == null || otp.length() != 6) {
            throw new BadCredentialsException("Invalid OTP format");
        }

        // 2. KrishiEaze Flow: If user doesn't exist, Signup automatically
        User user = userRepository.findByMobileNo(mobile)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setMobileNo(mobile);
                    return userRepository.save(newUser);
                });

        otpService.clearOtp(mobile);
        return new CustomAuthenticationToken(
                user.getAuthorities(), // 1. Authorities (Roles)
                user,                  // 2. Principal (The whole User object)
                null                   // 3. Credentials (OTP is no longer needed)
        );    }

    @Override
    public boolean supports(Class<?> auth) {
        return CustomAuthenticationToken.class.isAssignableFrom(auth);
    }
}
