package com.Backend.KrishiEaze.controller;

import com.Backend.KrishiEaze.dto.ApiResponseDto;
import com.Backend.KrishiEaze.dto.ProfileRequestDto;
import com.Backend.KrishiEaze.entities.Role;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.repositories.RoleRepository;
import com.Backend.KrishiEaze.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    /**
     * Updates the user profile after OTP verification.
     * @param user The authenticated user injected by Spring Security
     * @param dto  The profile data from the request body
     */
    @PutMapping("/update")
    public ResponseEntity<ApiResponseDto> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProfileRequestDto dto) {

        // 1. Map basic details
        user.setFirstName(dto.getFirstName());
        user.setMiddleName(dto.getMiddleName());
        user.setSurName(dto.getSurName());
        user.setDistrict(dto.getDistrict());
        user.setState(dto.getState());
        user.setAddress(dto.getAddress());
        user.setPinCode(dto.getPinCode());
//        user.setLat(dto.getLat());
//        user.setLng(dto.getLng());

        // 2. Convert String Role names to Database Role Entities
        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            Set<Role> assignedRoles = dto.getRoles().stream()
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new RuntimeException("Role not found: " + roleName)))
                    .collect(Collectors.toSet());
            user.setRoles(assignedRoles);
        }

        // 3. Mark profile as completed so 'newUser' becomes false in future logins
        user.setProfileCompleted(true);

        // 4. Save to Database
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponseDto("Profile updated successfully", true,user));
    }

    /**
     * Fetch current user profile details
     */
    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@AuthenticationPrincipal User user) {
        // Return the user object (Spring Jackson will convert it to JSON)
        return ResponseEntity.ok(user);
    }
}