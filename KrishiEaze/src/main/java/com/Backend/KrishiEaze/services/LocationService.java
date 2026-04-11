package com.Backend.KrishiEaze.services;

import com.Backend.KrishiEaze.dto.LocationRequestDto;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.exception.ResourceNotFoundException;
import com.Backend.KrishiEaze.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LocationService {
    private final UserRepository userRepository;

    @Transactional
    public void updateUserLocation(String mobileNo, LocationRequestDto locationDto) {
        User user = userRepository.findByMobileNo(mobileNo)
                .orElseThrow(() -> new ResourceNotFoundException("User not Found "));

        user.setLat(locationDto.getLat());
        user.setLng(locationDto.getLng());

        if (user.getFirstName() != null && user.getDistrict() != null) {
            user.setProfileCompleted(true);
        }

        userRepository.save(user);
    }
}
