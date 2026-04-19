package com.Backend.KrishiEaze.services;

import com.Backend.KrishiEaze.dto.SellRequestDto;
import com.Backend.KrishiEaze.dto.SellResponseDto;
import com.Backend.KrishiEaze.entities.Mandi;
import com.Backend.KrishiEaze.entities.SellRequest;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.entities.enums.RequestStatus;
import com.Backend.KrishiEaze.repositories.MandiRepository;
import com.Backend.KrishiEaze.repositories.SellRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SellRequestService {

    private final SellRequestRepository sellRequestRepository;
    private final MandiRepository mandiRepository;
    private final MandiService mandiService;

    // ✅ FARMER: Create sell request
    public SellResponseDto createSellRequest(SellRequestDto dto, User farmer) {

        // Find the mandi farmer selected
        Mandi selectedMandi = mandiRepository.findById(dto.getSelectedMandiId())
                .orElseThrow(() -> new RuntimeException("Mandi not found"));

        // Calculate distance
        double distance = mandiService.calculateDistance(
                farmer.getLat(), farmer.getLng(),
                selectedMandi.getLat(), selectedMandi.getLng());

        // Build and save sell request
        SellRequest sellRequest = SellRequest.builder()
                .farmer(farmer)
                .mandi(selectedMandi)
                .cropName(dto.getCropName())
                .quantity(dto.getQuantity())
                .unit(dto.getUnit())
                .expectedPricePerUnit(dto.getExpectedPricePerUnit())
                .harvestDate(dto.getHarvestDate())
                .qualityGrade(dto.getQualityGrade())
                .lat(farmer.getLat())
                .lng(farmer.getLng())
                .status(RequestStatus.PENDING) // ✅ always starts as PENDING
                .requestDate(LocalDateTime.now())
                .build();

        SellRequest saved = sellRequestRepository.save(sellRequest);

        // Build response
        return SellResponseDto.builder()
                .success(true)
                .message("Sell request created successfully")
                .data(SellResponseDto.SellData.builder()
                        .sellRequestId(String.valueOf(saved.getId()))
                        .status(saved.getStatus().name())
                        .assignedMandi(SellResponseDto.AssignedMandi.builder()
                                .mandiId(String.valueOf(selectedMandi.getId()))
                                .mandiName(selectedMandi.getMandiName())
                                .distanceKm(Math.round(distance * 100.0) / 100.0)
                                .build())
                        .build())
                .build();
    }

    // ✅ FARMER: View their own sell requests
    public List<SellRequest> getFarmerRequests(User farmer) {
        return sellRequestRepository.findByFarmerOrderByRequestDateDesc(farmer);
    }

    // ✅ ADMIN: View sell requests by status
    public List<SellRequest> getRequestsByStatus(RequestStatus status) {
        return sellRequestRepository.findByStatusOrderByRequestDateDesc(status);
    }

    // ✅ ADMIN: Accept a sell request
    public SellResponseDto acceptSellRequest(Long sellRequestId) {
        SellRequest sellRequest = sellRequestRepository.findById(sellRequestId)
                .orElseThrow(() -> new RuntimeException("Sell request not found"));

        if (sellRequest.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING requests can be accepted");
        }

        sellRequest.setStatus(RequestStatus.CONFIRMED);
        sellRequestRepository.save(sellRequest);

        Mandi mandi = sellRequest.getMandi();
        double distance = mandiService.calculateDistance(
                sellRequest.getLat(), sellRequest.getLng(),
                mandi.getLat(), mandi.getLng());

        return SellResponseDto.builder()
                .success(true)
                .message("Sell request accepted successfully")
                .data(SellResponseDto.SellData.builder()
                        .sellRequestId(String.valueOf(sellRequest.getId()))
                        .status(sellRequest.getStatus().name())
                        .assignedMandi(SellResponseDto.AssignedMandi.builder()
                                .mandiId(String.valueOf(mandi.getId()))
                                .mandiName(mandi.getMandiName())
                                .distanceKm(Math.round(distance * 100.0) / 100.0)
                                .build())
                        .build())
                .build();
    }

    // ✅ ADMIN: Reject a sell request
    public SellResponseDto rejectSellRequest(Long sellRequestId) {
        SellRequest sellRequest = sellRequestRepository.findById(sellRequestId)
                .orElseThrow(() -> new RuntimeException("Sell request not found"));

        if (sellRequest.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING requests can be rejected");
        }

        sellRequest.setStatus(RequestStatus.REJECTED);
        sellRequestRepository.save(sellRequest);

        return SellResponseDto.builder()
                .success(true)
                .message("Sell request rejected")
                .data(SellResponseDto.SellData.builder()
                        .sellRequestId(String.valueOf(sellRequest.getId()))
                        .status(sellRequest.getStatus().name())
                        .build())
                .build();
    }
}