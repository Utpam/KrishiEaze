package com.Backend.KrishiEaze.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TransportResponseDto {
    private Double totalTransportCost;
    private Double grossRevenue;
    private Double netProfit;
    private Double costPerQuintal;
}
