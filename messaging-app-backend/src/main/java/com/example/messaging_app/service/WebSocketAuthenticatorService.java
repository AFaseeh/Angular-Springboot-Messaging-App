package com.example.messaging_app.service;

import java.util.Collections;

import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.messaging_app.repo.UserRepo;

@Service
public class WebSocketAuthenticatorService {

    private final UserRepo userRepo;
    private final PasswordEncoder encoder;

    public WebSocketAuthenticatorService(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.encoder = passwordEncoder;
    }

    public UsernamePasswordAuthenticationToken getAuthenticatedOrFail(final String  username, final String password) {
        if (username == null || username.trim().isEmpty()) {
            throw new AuthenticationCredentialsNotFoundException("Username was null or empty.");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new AuthenticationCredentialsNotFoundException("Password was null or empty.");
        }

        if (fetchUserFromDb(username, password) == false) {
            throw new BadCredentialsException("Bad credentials for user " + username);
        }

        return new UsernamePasswordAuthenticationToken(
                username,
                password,
                
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    private boolean fetchUserFromDb(String username, String password)
    {
        var user = userRepo.findByUserName(username);
        if (user.isEmpty()) return false;

        return encoder.matches(password, user.get().getPassword());
    }

}
