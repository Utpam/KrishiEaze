package com.Backend.KrishiEaze.dto;

import com.Backend.KrishiEaze.entities.type.RoleType;
import lombok.Data;
import lombok.RequiredArgsConstructor;

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
    private RoleType role;
}
