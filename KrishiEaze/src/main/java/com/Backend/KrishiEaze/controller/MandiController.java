package com.Backend.KrishiEaze.controller;

import com.Backend.KrishiEaze.dto.AgmarknetApiResponseDto;
import com.Backend.KrishiEaze.dto.MandiRequestDto;
import com.Backend.KrishiEaze.dto.MandiResponseDto;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.repositories.UserRepository;
import com.Backend.KrishiEaze.services.MandiService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
// @AllArgsConstructor
@RequiredArgsConstructor
@RequestMapping("/api/v1/mandi")
public class MandiController {

    private final MandiService mandiService;
    private final UserRepository userRepository;

    @GetMapping("/nearest")
    public ResponseEntity<List<MandiResponseDto>> getNearestMandis(
            @RequestParam String crop,
            @AuthenticationPrincipal User user) {

        // ✅ Fetch logged-in user's lat/lng from DB
        User user1 = userRepository.findByMobileNo(user.getMobileNo())
                .orElseThrow(() -> new RuntimeException("User not found"));

        MandiRequestDto requestDto = MandiRequestDto.builder()
                .lat(user1.getLat())
                .lng(user1.getLng())
                .crop(crop)
                .build();

        List<MandiResponseDto> nearby = mandiService.getNearbyMandis(requestDto);
        return ResponseEntity.ok(nearby);
    }
}
