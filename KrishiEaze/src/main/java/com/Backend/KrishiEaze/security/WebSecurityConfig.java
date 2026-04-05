package com.Backend.KrishiEaze.security;

import com.Backend.KrishiEaze.dto.ApiError;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import tools.jackson.databind.ObjectMapper;

@Configuration
@RequiredArgsConstructor
public class WebSecurityConfig {
    @Autowired
    private CustomAuthenticationProvider customAuthProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ObjectMapper objectMapper; // Let Spring inject the existing bean

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http){
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll() // Allow OTP and Login endpoints
                         .requestMatchers("/api/profile/**").authenticated()
                .anyRequest().authenticated()
        )
                .exceptionHandling(ex-> ex.authenticationEntryPoint((request, response, authException) -> {
                    //authException.printStackTrace();
                    response.setStatus(401);
                    response.setContentType("application/json");
                    String message = authException.getMessage();
                    String error = (String) request.getAttribute("error");
                    if (error != null) {
                        message = error;
                    }
//                    Map<String,String> errorMap = Map.of(
//                            "message",message,
//                            "statusCode", String.valueOf(401)
//                    );
                    //converting string into json
                    var apiError = ApiError.of(
                            HttpStatus.UNAUTHORIZED.value(),
                            "Unauthorized Access!!",
                            message, request.getRequestURI(),
                            true);
                    var objectMapper = new ObjectMapper();
                    response.getWriter().write(objectMapper.writeValueAsString(apiError));                }))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        // Register your Custom Provider here
        authenticationManagerBuilder.authenticationProvider(customAuthProvider);

        return authenticationManagerBuilder.build();
    }
}
