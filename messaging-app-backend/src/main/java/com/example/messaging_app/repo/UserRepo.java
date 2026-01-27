package com.example.messaging_app.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.messaging_app.model.ChatUser;

public interface UserRepo extends JpaRepository<ChatUser, Integer> {
    
}
