package com.Backend.KrishiEaze.entities;

import com.Backend.KrishiEaze.entities.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sell_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User farmer;

    @ManyToOne
    @JoinColumn(name = "mandi_id", nullable = false)
    private Mandi mandi;

    private String cropName;
    private Double quantity;
    private String unit;
    private Double expectedPricePerUnit;
    private java.time.LocalDate harvestDate;
    private String qualityGrade;
    @Enumerated(EnumType.STRING)
    private RequestStatus status;
    private LocalDateTime requestDate = LocalDateTime.now();
    private Double lat;
    private Double lng;
}
