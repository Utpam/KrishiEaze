package com.Backend.KrishiEaze.controller;

import com.Backend.KrishiEaze.dto.ApiResponseDto;
import com.Backend.KrishiEaze.dto.ProfileRequestDto;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.services.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    @Autowired
    private ProfileService profileService;

    @PostMapping
    public ResponseEntity<ApiResponseDto> setProfile(@RequestBody ProfileRequestDto profileRequestDto, @RequestHeader("mobileNo") String mobileNo) {
        profileService.completeProfile(profileRequestDto,mobileNo);
        ApiResponseDto apiResponseDto = new ApiResponseDto();
        apiResponseDto.setMessage("Profile completed successfully! Welcome to KrishiEaze.");
        apiResponseDto.setSuccess(true);
        return ResponseEntity.ok(apiResponseDto);
    }
    @PutMapping
    public ResponseEntity<ApiResponseDto> updateProfile(@RequestBody ProfileRequestDto profileRequestDto, @RequestHeader String mobileNo) {
        User updatedUser =profileService.updateProfileFields(profileRequestDto,mobileNo);
        ApiResponseDto apiResponseDto = new ApiResponseDto();
        apiResponseDto.setMessage("Fields Updated Successfully");
        apiResponseDto.setSuccess(true);
        apiResponseDto.setData(updatedUser);
        return ResponseEntity.ok(apiResponseDto);
    }
}
