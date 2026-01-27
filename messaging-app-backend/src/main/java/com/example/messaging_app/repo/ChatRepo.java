package com.example.messaging_app.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.messaging_app.model.ChatMessage;

public interface ChatRepo extends JpaRepository<ChatMessage, Integer>  {
    
}
