package com.Backend.KrishiEaze.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LocationRequestDto {
    @NotNull(message = "Latitude is required")
    private Double lat;

    @NotNull(message = "Longitude is required")
    private Double lng;
}
