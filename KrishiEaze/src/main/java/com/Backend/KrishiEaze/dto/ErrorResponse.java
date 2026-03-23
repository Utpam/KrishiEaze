package com.Backend.KrishiEaze.dto;

import org.springframework.http.HttpStatus;

public record ErrorResponse(
        int status,
        String error,
        String message,
        String path
        ) {
    public static ErrorResponse of(int status, String error,String message,String path) {
        return new ErrorResponse(status,error,message,path);
    }
}
