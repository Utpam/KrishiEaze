package com.Backend.KrishiEaze.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SellRequestDto {
    private Long selectedMandiId; // From the "Sell" button click
    private String cropName;
    private Double quantity;
    private String unit;
    private Double expectedPricePerUnit;
    private java.time.LocalDate harvestDate;
    private String qualityGrade;
    private Double lat; // Farmer's current GPS
    private Double lng; // Farmer's current GPS
}
