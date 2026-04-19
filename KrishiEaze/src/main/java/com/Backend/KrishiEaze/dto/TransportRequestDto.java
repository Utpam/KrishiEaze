package com.Backend.KrishiEaze.dto;

import lombok.Data;

@Data
public class TransportRequestDto {
    private Long mandiId;
    private String crop;      // To fetch the correct price
    private Double quantity;
    private String fuelType;
    private Double fuelPrice;
    private Double mileage;
}
