package com.Backend.KrishiEaze.security;

import com.Backend.KrishiEaze.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {
    private final SecretKey secretKey;
    private final long accessTtlSeconds;
    private final long refreshTtlSeconds;
    private final String issuer;

    public JwtService(
            @Value("${security.jwt.secretKey}") String secret,
            @Value("${security.jwt.access-ttl-seconds}") long accessTtlSeconds,
            @Value("${security.jwt.refresh-ttl-seconds}") long refreshTtlSeconds,
            @Value("${security.jwt.issuer}") String issuer) {

        if (secret == null || secret.length() < 64) {
            throw new IllegalArgumentException("Invalid Secret") ;
        }
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTtlSeconds = accessTtlSeconds;
        this.refreshTtlSeconds = refreshTtlSeconds;
        this.issuer = issuer;
    }

    //generate Jwt Token
    public String generateJwtToken(User user,String jti) {
        Instant now = Instant.now();
        List<String> roles;

        if (user.getRoles() == null) {
            roles = List.of();
        } else {
            roles = user.getRoles()
                    .stream()
                    .map(role -> role.getName())
                    .toList();
        }
        return Jwts.builder()
                .id(jti)
                .subject(user.getId().toString())
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(accessTtlSeconds)))
                .claims(Map.of(
                        "mobileNo", user.getMobileNo(),
                        "roles", roles,
                        "typ", "access"
                ))
                .signWith(secretKey, Jwts.SIG.HS512)
                .compact();
    }

    //generate refresh token
    public String generateRefreshToken(User user, String jti) {
        Instant now = Instant.now();
        return Jwts.builder()
                .id(jti)
                .subject(user.getMobileNo())
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(refreshTtlSeconds)))
                .claim("typ","refresh")
                .signWith(secretKey,Jwts.SIG.HS512)
                .compact();
    }

    //parse the token
    public Jws<Claims> parse(String token) {
        try {
            return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    public boolean isAccessToken(String token) {
        Claims c = parse(token).getPayload();
        return "access".equals(c.get("typ"));
    }
    public boolean isRefreshToken(String token) {
        Claims c = parse(token).getPayload();
        return "refresh".equals(c.get("typ"));
    }
    public Long getUserId(String token) {
        Claims c = parse(token).getPayload();
        return Long.valueOf(c.getSubject());
    }
//    public String getEmail(String token) {
//        Claims c = parse(token).getPayload();
//        return "email".equals(c.get(user.getEmail));
//    }

    public boolean validateToken(String token) {
        try {
            parse(token); // If this doesn't throw an exception, it's valid
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Extract the "sub" field from the token
    public String extractSubject(String token) {
        return parse(token).getPayload().getSubject();
    }

    // Extract the "mobileNo" custom claim (since refresh token uses it as subject)
    public String extractMobileNo(String token) {
        Claims claims = parse(token).getPayload();
        // In your generateRefreshToken, you set subject to mobileNo
        // In your generateJwtToken, you set a custom claim "mobileNo"
        String mobileNo = claims.get("mobileNo", String.class);
        if (mobileNo == null) {
            mobileNo = claims.getSubject(); // Fallback to subject
        }
        return mobileNo;
    }

    public long getExpirationTime() {
        return this.accessTtlSeconds;
    }
}
