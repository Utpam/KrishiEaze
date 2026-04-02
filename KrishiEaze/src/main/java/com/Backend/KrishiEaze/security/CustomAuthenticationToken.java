package com.Backend.KrishiEaze.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

// security/MobileAuthenticationToken.java
public class CustomAuthenticationToken extends AbstractAuthenticationToken {
    private final Object principal;
    private final Object credentials;

    public CustomAuthenticationToken(String mobileNo, String otp) {
        super((Collection<? extends GrantedAuthority>) null);
        this.principal = mobileNo;
        this.credentials = otp;
        setAuthenticated(false);
    }

    public CustomAuthenticationToken(Object principal,Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.credentials = credentials;
        super.setAuthenticated(true);
    }

    @Override public Object getCredentials() { return this.credentials; }
    @Override public Object getPrincipal() { return this.principal; }
}
