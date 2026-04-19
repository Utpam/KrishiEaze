package com.Backend.KrishiEaze.controller;

import com.Backend.KrishiEaze.dto.SellRequestDto;
import com.Backend.KrishiEaze.dto.SellResponseDto;
import com.Backend.KrishiEaze.entities.SellRequest;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.entities.enums.RequestStatus;
import com.Backend.KrishiEaze.services.SellRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mandi")
public class SellRequestController {

    private final SellRequestService sellRequestService;

    // ✅ FARMER: Create sell request
    @PostMapping("/sell-request")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<SellResponseDto> createSellRequest(
            @RequestBody SellRequestDto dto,
            @AuthenticationPrincipal User loggedInUser) {

        SellResponseDto response = sellRequestService.createSellRequest(dto, loggedInUser);
        return ResponseEntity.ok(response);
    }

    // ✅ FARMER: View their own sell requests
    @GetMapping("/sell-request/my-requests")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<List<SellRequest>> getMyRequests(
            @AuthenticationPrincipal User loggedInUser) {

        return ResponseEntity.ok(sellRequestService.getFarmerRequests(loggedInUser));
    }

    // ✅ ADMIN: View sell requests by status
    @GetMapping("/sell-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SellRequest>> getSellRequestsByStatus(
            @RequestParam RequestStatus status) {

        return ResponseEntity.ok(sellRequestService.getRequestsByStatus(status));
    }

    // ✅ ADMIN: Accept sell request
    @PostMapping("/sell-request/{sellRequestId}/accept")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SellResponseDto> acceptRequest(
            @PathVariable Long sellRequestId) {

        return ResponseEntity.ok(sellRequestService.acceptSellRequest(sellRequestId));
    }

    // ✅ ADMIN: Reject sell request
    @PostMapping("/sell-request/{sellRequestId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SellResponseDto> rejectRequest(
            @PathVariable Long sellRequestId) {

        return ResponseEntity.ok(sellRequestService.rejectSellRequest(sellRequestId));
    }
}