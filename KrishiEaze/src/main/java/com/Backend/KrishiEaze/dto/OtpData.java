package com.Backend.KrishiEaze.dto;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class OtpData {
    private final String otp;
    private final long expiryTime;

    public OtpData(String otp, long durationInMinutes) {
        this.otp = otp;
        // Current time + 5 minutes in milliseconds
        this.expiryTime = System.currentTimeMillis() + (durationInMinutes * 60 * 1000);
    }

    public boolean isExpired() {
        return System.currentTimeMillis() > expiryTime;
    }

}
