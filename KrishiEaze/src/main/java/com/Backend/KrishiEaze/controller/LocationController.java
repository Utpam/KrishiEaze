package com.Backend.KrishiEaze.controller;

import com.Backend.KrishiEaze.dto.ApiResponseDto;
import com.Backend.KrishiEaze.dto.LocationRequestDto;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.services.LocationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/location")
@AllArgsConstructor
public class LocationController {

    private final LocationService locationService;
    @PostMapping("/update-location")
  //  @PreAuthorize("hasAnyRole('FARMER', 'BUYER')")
    public ResponseEntity<ApiResponseDto> updateLocation(
            @Valid @RequestBody LocationRequestDto locationDto,
            @AuthenticationPrincipal User user) {

        locationService.updateUserLocation(user.getMobileNo(), locationDto);
        return ResponseEntity.ok(ApiResponseDto.of("Location synchronized with GPS", true));
    }
}
