package com.Backend.KrishiEaze.services;

import com.Backend.KrishiEaze.dto.ProfileRequestDto;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ProfileService {
    @Autowired
    private UserRepository userRepository;
    public void completeProfile(ProfileRequestDto profileRequestDto, String mobileNo) {
        User user = userRepository.findByMobileNo(mobileNo).orElseThrow();

        user.setFirstName(profileRequestDto.getFirstName());
        user.setMiddleName(profileRequestDto.getMiddleName());
        user.setSurName(profileRequestDto.getSurName());
        user.setRole(profileRequestDto.getRole());
        user.setAddress(profileRequestDto.getAddress());
        user.setDistrict(profileRequestDto.getDistrict());
        user.setState(profileRequestDto.getState());
        user.setPinCode(profileRequestDto.getPinCode());
        user.setProfileCompleted(true);
        userRepository.save(user);

    }
}
