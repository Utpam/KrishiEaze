package com.Backend.KrishiEaze.repositories;

import com.Backend.KrishiEaze.entities.TransportCalculation;
import com.Backend.KrishiEaze.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransportCalculationRepository extends JpaRepository<TransportCalculation, Long> {
    List<TransportCalculation> findByFarmerOrderByCalculatedAtDesc(User farmer);
}