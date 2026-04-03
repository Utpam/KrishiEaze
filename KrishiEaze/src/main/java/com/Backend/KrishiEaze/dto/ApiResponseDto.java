package com.Backend.KrishiEaze.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor // This fixes the "found 2 arguments" error
@NoArgsConstructor  // Necessary for JSON deserialization
public class ApiResponseDto {
    private String message;
    private boolean success;
    private Object data;

    // Industry Standard: Static factory method for quick responses without data
    public static ApiResponseDto of(String message, boolean success) {
        return new ApiResponseDto(message, success, null);
    }

    // Overloaded for when you want to send data back
    public static ApiResponseDto of(String message, boolean success, Object data) {
        return new ApiResponseDto(message, success, data);
    }
}