package com.Backend.KrishiEaze.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MandiRequestDto {
    private Double lat;
    private Double lng;
    private String crop; // The specific crop the farmer is interested in
}