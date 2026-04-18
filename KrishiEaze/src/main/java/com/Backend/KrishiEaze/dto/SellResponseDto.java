package com.Backend.KrishiEaze.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
public class SellResponseDto {
    private boolean success;
    private String message;
    private SellData data;

    @Data
    @Builder
    public static class SellData {
        private String sellRequestId;
        private AssignedMandi assignedMandi;
        private String status;
    }

    @Data
    @Builder
    @Getter
    @Setter
    public static class AssignedMandi {
        private String mandiId;
        private String mandiName;
        private Double distanceKm;
    }
}
