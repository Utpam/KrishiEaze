package com.Backend.KrishiEaze.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class AgmarknetApiResponseDto {
    private String status;
    private int total;
    private List<AgmarknetRecord> records;

    @Data
    public static class AgmarknetRecord {
        @JsonProperty("state")
        private String state;

        @JsonProperty("district")
        private String district;

        @JsonProperty("market") // Maps "Market" from JSON to this variable
        private String market;

        @JsonProperty("commodity")
        private String commodity;

        @JsonProperty("variety")
        private String variety;

        @JsonProperty("arrival_date")
        private String arrival_date;

        @JsonProperty("modal_price") // Maps "Modal_Price" from JSON
        private Double modal_price;

        @JsonProperty("min_price")
        private Double min_price;

        @JsonProperty("max_price")
        private Double max_price;
    }
}
