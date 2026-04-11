package com.Backend.KrishiEaze.repositories;

import com.Backend.KrishiEaze.entities.Mandi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MandiRepository extends JpaRepository<Mandi, Long> {
}