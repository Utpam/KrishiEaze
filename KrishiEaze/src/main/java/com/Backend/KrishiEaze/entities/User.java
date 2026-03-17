package com.Backend.KrishiEaze.entities;

import com.Backend.KrishiEaze.entities.type.RoleType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "users")
@Getter
@Setter
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String mobileNo;
    @Column(nullable = false,columnDefinition = "boolean default false")
    private boolean profileCompleted = false;
    private String firstName;
    private String middleName;
    private String surName;
    private String district;
    private String state;
    @Column(length = 500)
    private String address;
    private RoleType role;
    private String pinCode;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }
}
