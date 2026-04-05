package com.Backend.KrishiEaze.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @JsonIgnore
    private String password;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    @Column(unique = true, nullable = false, length = 10)
    private String mobileNo;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean profileCompleted = false;

    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    private String middleName;

    @Size(min = 2, max = 50, message = "Surname must be between 2 and 50 characters")
    private String surName;

    private String district;
    private String state;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean isEnable = true;

    @Column(length = 500)
    @Size(max = 500, message = "Address is too long")
    private String address;

    @Pattern(regexp = "^\\d{6}$", message = "Pincode must be exactly 6 digits")
    @Column(length = 6)
    private String pinCode;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    // --- UserDetails Implementation ---

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() { return true; }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() { return true; }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    @JsonIgnore
    public boolean isEnabled() { return isEnable; }
}