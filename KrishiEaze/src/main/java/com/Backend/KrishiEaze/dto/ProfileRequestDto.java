package com.Backend.KrishiEaze.dto;

import com.Backend.KrishiEaze.entities.Role;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Set;

@Data
@RequiredArgsConstructor
public class ProfileRequestDto {
    private String firstName;
    private String middleName;
    private String surName;
    private String address;
    public String state;
    private String district;
    private String pinCode;
    private Set<String> role;
}
