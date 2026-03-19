package com.Backend.KrishiEaze.dto;

import lombok.Data;

@Data
public class ApiResponseDto {
    private String message;
    private boolean success;
    private Object data;
}
