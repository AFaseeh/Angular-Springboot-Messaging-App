package com.example.messaging_app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.messaging_app.model.ChatMessage;
import com.example.messaging_app.model.ChatUser;
import com.example.messaging_app.repo.ChatRepo;
import com.example.messaging_app.repo.UserRepo;

@Service
public class ChatService {
    UserRepo userRepo;
    ChatRepo chatRepo;
    
    ChatService(UserRepo userRepo, ChatRepo chatRepo) {
        this.userRepo = userRepo;
        this.chatRepo = chatRepo;
    }
    
    public ChatUser CreateNewUser(String userName) 
    {
        return userRepo.save(new ChatUser(null, userName));
    }
    public List<ChatMessage> getMessages() {
        return chatRepo.findAll();
    }

    public ChatMessage saveMessage(ChatMessage msg)
    {
        return chatRepo.save(msg);
    }
}
