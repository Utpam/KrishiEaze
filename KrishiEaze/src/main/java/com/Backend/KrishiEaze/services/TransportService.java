package com.Backend.KrishiEaze.services;

import com.Backend.KrishiEaze.dto.TransportRequestDto;
import com.Backend.KrishiEaze.dto.TransportResponseDto;
import com.Backend.KrishiEaze.entities.Mandi;
import com.Backend.KrishiEaze.entities.TransportCalculation;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.repositories.MandiRepository;
import com.Backend.KrishiEaze.repositories.TransportCalculationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransportService {

    private final TransportCalculationRepository calculationRepository;
    private final MandiRepository mandiRepository;
    private final MandiService mandiService; // Inject the MandiService

    public TransportResponseDto calculateAndSave(TransportRequestDto request, User user) {
        // 1. Fetch Mandi from DB
        Mandi mandi = mandiRepository.findById(request.getMandiId())
                .orElseThrow(() -> new RuntimeException("Mandi not found"));

        // 2. AUTO-FETCH Price using the new MandiService method
        Double livePrice = mandiService.getLivePriceForMandi(mandi.getMandiName(), request.getCrop(), mandi.getState());

        if (livePrice == null) {
            livePrice = mandiService.getFallbackPriceByCrop(request.getCrop(), mandi.getBasePrice());
        }

        // 3. Distance & Profit Math
        double distance = mandiService.calculateDistance(user.getLat(), user.getLng(), mandi.getLat(), mandi.getLng());
        double totalCost = ( (distance * 2) / request.getMileage() ) * request.getFuelPrice();
        double netProfit = (livePrice * request.getQuantity()) - totalCost;

        // 4. Save to History (Entity Option 2)
        TransportCalculation record = TransportCalculation.builder()
                .farmer(user)
                .mandiName(mandi.getMandiName())
                .distanceKm(distance)
                .modalPriceAtCalculation(livePrice)
                .quantity(request.getQuantity())
                .fuelType(request.getFuelType())
                .fuelPrice(request.getFuelPrice())
                .mileage(request.getMileage())
                .totalTransportCost(Math.round(totalCost * 100.0) / 100.0)
                .estimatedNetProfit(Math.round(netProfit * 100.0) / 100.0)
                .calculatedAt(LocalDateTime.now())
                .build();

        calculationRepository.save(record);
        double grossRevenue = livePrice * request.getQuantity();
        double costPerQuintal = totalCost / request.getQuantity();

        return TransportResponseDto.builder()
                .totalTransportCost(record.getTotalTransportCost())
                .netProfit(record.getEstimatedNetProfit())
                .grossRevenue(Math.round(grossRevenue * 100.0) / 100.0) // Add this
                .costPerQuintal(Math.round(costPerQuintal * 100.0) / 100.0)
                .build();
    }



    // Re-use your Haversine logic here or move to a Utility class
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371 * c; // Earth's radius in KM
    }
}