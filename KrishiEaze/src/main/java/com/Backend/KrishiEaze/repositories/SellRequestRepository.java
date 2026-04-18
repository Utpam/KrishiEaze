package com.Backend.KrishiEaze.repositories;

import com.Backend.KrishiEaze.entities.SellRequest;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.entities.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellRequestRepository extends JpaRepository<SellRequest, Long> {
  // For Farmer: View their own requests
  List<SellRequest> findByFarmerOrderByRequestDateDesc(User farmer);

  // For Admin: Sort based on Status (PENDING, CONFIRMED, REJECTED)
  List<SellRequest> findByStatusOrderByRequestDateDesc(RequestStatus status);
}