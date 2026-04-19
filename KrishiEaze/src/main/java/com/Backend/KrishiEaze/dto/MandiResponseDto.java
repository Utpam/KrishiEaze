package com.Backend.KrishiEaze.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MandiResponseDto {
    private Long mandiId;
    private String mandiName;
    private String state;
    private String district;
    private String commodity;
    private String modalPrice;
    private String priceUnit = "₹/quintal";
  //  private String marketStatus; // ✅ new field
    private Double distanceKm;
    private Double lat;
    private Double lng;
}