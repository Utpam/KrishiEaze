package com.Backend.KrishiEaze.services;

import com.Backend.KrishiEaze.dto.OtpData;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    // Stores Mobile -> OTP
    private final Map<String, OtpData> otpCache = new ConcurrentHashMap<>();

    public void saveOtp(String mobileNo, String otp) {
        otpCache.put(mobileNo, new OtpData(otp,2));
    }

    public boolean isOtpValid(String mobileNo, String otp) {
        OtpData cachedData = otpCache.get(mobileNo);

        if (cachedData == null) {
            return false; // No OTP requested for this number
        }

        if (cachedData.isExpired()) {
            otpCache.remove(mobileNo); // Clean up expired data
            return false;
        }
        return cachedData.getOtp().equals(otp);
    }
    //Delete all Otp after 1 hour
    @Scheduled(fixedRate = 3600000)
    public void purgeExpiredOtps() {
        int initialSize = otpCache.size();

        // Remove entries where isExpired() returns true
        otpCache.entrySet().removeIf(entry -> entry.getValue().isExpired());

        int removedCount = initialSize - otpCache.size();
        if (removedCount > 0) {
            System.out.println("Scheduled Cleanup: Removed " + removedCount + " expired OTPs.");
        }
    }

    public void clearOtp(String mobileNo) {
        otpCache.remove(mobileNo);
    }
}
