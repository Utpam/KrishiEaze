package com.Backend.KrishiEaze.entities;

import jakarta.persistence.*;
import lombok.*;
//import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransportCalculation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User farmer;

    // Mandi & Crop Context
    private String mandiName;
    private String crop; // Added to know what crop was calculated
    private Double distanceKm;
    private Double modalPriceAtCalculation; // Added to store the live price fetched

    // Farmer Inputs
    private Double quantity;
    private String fuelType;
    private Double fuelPrice;
    private Double mileage;

    // Results
    private Double totalTransportCost;
    private Double estimatedNetProfit;

    private LocalDateTime calculatedAt;
}