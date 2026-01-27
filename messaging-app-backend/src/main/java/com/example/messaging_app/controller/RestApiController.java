package com.example.messaging_app.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.messaging_app.model.ChatMessage;
import com.example.messaging_app.model.ChatUser;
import com.example.messaging_app.service.ChatService;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class RestApiController {
    private ChatService chatService;

    RestApiController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/users/add/{userName}")
    public ChatUser CreateNewUser(@PathVariable String userName) 
    {
        return chatService.CreateNewUser(userName);
    }

    @GetMapping("/chat/messages")
    public List<ChatMessage> getMessages() {
        return chatService.getMessages();
    }
    
}
