package com.Backend.KrishiEaze.exception;

import com.Backend.KrishiEaze.dto.ApiResponseDto;
import com.Backend.KrishiEaze.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException exception) {
        ErrorResponse errorResponse = new ErrorResponse(exception.getMessage(), HttpStatus.NOT_FOUND);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponseDto> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponseDto.of("Invalid mobile number or OTP", false));
    }

    // 3. Handle Security: Access Denied (Role mismatch)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponseDto> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponseDto.of("You do not have permission to access this resource", false));
    }

    // 4. Handle Validation Errors (e.g., @Valid on DTOs)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseDto> handleValidationErrors(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponseDto.of("Validation failed: " + errors, false));
    }

    // 5. The "Global Catch-All" - Prevents app crash and hides stack traces
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDto> handleGeneralException(Exception ex) {
        // Log the actual error for debugging
        ex.printStackTrace();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.of("An unexpected error occurred. Please try again later.", false));
    }
}
