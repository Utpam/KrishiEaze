package com.Backend.KrishiEaze.repositories;

import com.Backend.KrishiEaze.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByMobileNo(String mobile);
}