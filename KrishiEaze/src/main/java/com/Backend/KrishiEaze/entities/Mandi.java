package com.Backend.KrishiEaze.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@RequiredArgsConstructor
@Table(name = "mandi")
@Builder
@Getter
@Setter
public class Mandi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String mandiName;
    @Column(nullable = false)
    private String district;
    @Column(nullable = false)
    private String state;
    @Column(nullable = false)
    private Double lat;
    @Column(nullable = false)
    private Double lng;
}
