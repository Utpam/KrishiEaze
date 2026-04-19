package com.Backend.KrishiEaze.controller;

import com.Backend.KrishiEaze.dto.TransportRequestDto;
import com.Backend.KrishiEaze.dto.TransportResponseDto;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.services.TransportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transport")
@RequiredArgsConstructor
public class TransportController {

    private final TransportService transportService;

    /**
     * The farmer clicks "Calculate" on a Mandi card.
     * The Frontend sends: mandiId, crop, quantity, fuelType, fuelPrice, mileage.
     */
    @PostMapping("/calculate")
    public ResponseEntity<TransportResponseDto> calculate(
            @RequestBody TransportRequestDto request,
            @AuthenticationPrincipal User user) {

        // We pass the logged-in User so the service can link the history
        TransportResponseDto response = transportService.calculateAndSave(request, user);

        return ResponseEntity.ok(response);
    }
}