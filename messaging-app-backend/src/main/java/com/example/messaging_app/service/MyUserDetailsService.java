package com.example.messaging_app.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.messaging_app.model.ChatUser;
import com.example.messaging_app.model.UserPrincipal;
import com.example.messaging_app.repo.UserRepo;

@Service
public class MyUserDetailsService implements UserDetailsService{

    private UserRepo repo;

    public MyUserDetailsService(UserRepo repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        ChatUser user = repo.findByUserName(username).orElseThrow(() -> new UsernameNotFoundException("User Not Found: \"" + username + "\""));

        return new UserPrincipal(user);
    }
    
}
