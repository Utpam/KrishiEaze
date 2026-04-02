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
        logger.info("Authorization Header: {}" ,header);

        //Token extraction, then validation then create Authentication and loads into security context
        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            try {
                //check access token
                if (!jwtService.isAccessToken(token)) {//if token is not access token
                    filterChain.doFilter(request,response);//move to next filter
                    return;
                }
                Jws<Claims> parse = jwtService.parse(token);
                Claims payload = parse.getPayload();
                String mobileNo =payload.getSubject();

                userRepository.findByMobileNo(mobileNo)
                        .ifPresent(user ->{

                            //check if user is enabled or not
                            if (!user.isEnable() ) {//If user is not enable then move to next filter
                                try {
                                    filterChain.doFilter(request,response);
                                    return;
                                } catch (IOException e) {
                                    throw new RuntimeException(e);
                                } catch (ServletException e) {
                                    throw new RuntimeException(e);
                                }
                            }
                            //after getting user we can extract details from him like roles etc
                            List<GrantedAuthority> authorities;

                            if (user.getRoles() == null) {
                                authorities = List.of();
                            } else {
                                authorities = user.getRoles()
                                        .stream()
                                        .map(role -> new SimpleGrantedAuthority(role.getName()))
                                        .collect(Collectors.toList());
                            }
                            CustomAuthenticationToken authentication = new CustomAuthenticationToken(
                                    authorities,
                                    user.getMobileNo(),
                                    null
                            );
                            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));//Stores:Remote IP address and Session ID
                            //checks if context doesn't have any context before loading authentication in context holder
                            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                                SecurityContextHolder.getContext().setAuthentication(authentication);//loads authenticated object inside security context so user can access authorize request according to his role
                            }

                        });

            } catch (ExpiredJwtException e) {
                request.setAttribute("error","Token Expired");
                // e.printStackTrace();
            }  catch (Exception e) {
                /* e.printStackTrace(); */
                request.setAttribute("error","Invalid Token");
            }
        }
        filterChain.doFilter(request,response);//moves to next filter
        //CALL doFilter()
        //Request continues →
        //Controller is reached →
        //API works

    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().startsWith("/api/v1/auth");
    }
}