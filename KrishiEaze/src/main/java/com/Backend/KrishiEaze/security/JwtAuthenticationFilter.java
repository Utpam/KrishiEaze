package com.Backend.KrishiEaze.security;

import com.Backend.KrishiEaze.repositories.UserRepository;
import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                // 1. If it's NOT an access token, we just stop doing JWT logic.
                // We DON'T call doFilter here. We let the one at the bottom handle it.
                if (jwtService.isAccessToken(token)) {

                    Claims payload = jwtService.parse(token).getPayload();

                    // 2. Use the correct claim for the lookup
                    String mobileNo = payload.get("mobileNo", String.class);

                    userRepository.findByMobileNo(mobileNo).ifPresent(user -> {

                        // 3. Simple check: if enabled, set the context.
                        if (user.isEnable() && SecurityContextHolder.getContext().getAuthentication() == null) {

                            List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                                    .map(role -> new SimpleGrantedAuthority(role.getName()))
                                    .collect(Collectors.toList());

                            // 4. Pass the USER OBJECT to satisfy AuthService casting
                            CustomAuthenticationToken authentication = new CustomAuthenticationToken(
                                    authorities,
                                    user,
                                    null
                            );

                            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    });
                }
            } catch (ExpiredJwtException e) {
                request.setAttribute("error", "Token Expired");
            } catch (Exception e) {
                request.setAttribute("error", "Invalid Token");
            }
        }

        // 5. THE ONLY DO-FILTER.
        // If the token was bad, disabled, or not an access token,
        // the context is just empty and the next security filter will block it.
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().startsWith("/auth");
    }
}