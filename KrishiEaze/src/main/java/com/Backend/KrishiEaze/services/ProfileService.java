package com.Backend.KrishiEaze.services;

import com.Backend.KrishiEaze.dto.ProfileRequestDto;
import com.Backend.KrishiEaze.entities.User;
import com.Backend.KrishiEaze.exception.ResourceNotFoundException;
import com.Backend.KrishiEaze.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProfileService {
    @Autowired
    private UserRepository userRepository;
//    private final ModelMapper modelMapper;
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

    public User updateProfileFields(ProfileRequestDto profileRequestDto, String mobileNo) {
        User existingUser = userRepository.findByMobileNo(mobileNo).orElseThrow(()-> new ResourceNotFoundException("User with provided Mobile Number does not exists"));
        if (profileRequestDto.getFirstName() != null) {
            existingUser.setFirstName(profileRequestDto.getFirstName());
        }
        if (profileRequestDto.getMiddleName() != null) {
            existingUser.setMiddleName(profileRequestDto.getMiddleName());
        }
        if (profileRequestDto.getSurName() != null) {
            existingUser.setSurName(profileRequestDto.getSurName());
        }
        if(profileRequestDto.getAddress() != null) {
            existingUser.setAddress(profileRequestDto.getAddress());
        }
        if(profileRequestDto.getState() != null) {
            existingUser.setState(profileRequestDto.getState());
        }
        if(profileRequestDto.getDistrict() != null) {
            existingUser.setDistrict(profileRequestDto.getDistrict());
        }
        if(profileRequestDto.getPinCode() != null) {
            existingUser.setPinCode(profileRequestDto.getPinCode());
        }
        if (existingUser.getFirstName() != null && existingUser.getDistrict() != null) {
            existingUser.setProfileCompleted(true);
        }
        User updatedUser = userRepository.save(existingUser);
        return updatedUser;
    }
}
