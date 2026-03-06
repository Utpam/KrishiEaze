package com.Backend.KrishiEaze.security;

import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.repositories.UserRepository;
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
    // Note: In a real app, verify OTP against Redis/Database

    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {
        String mobile = (String) auth.getPrincipal();
        String otp = (String) auth.getCredentials();

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

        return new CustomAuthenticationToken(user,user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> auth) {
        return CustomAuthenticationToken.class.isAssignableFrom(auth);
    }
}
