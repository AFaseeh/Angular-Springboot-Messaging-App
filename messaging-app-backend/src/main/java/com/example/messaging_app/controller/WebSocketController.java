package com.example.messaging_app.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.example.messaging_app.model.ChatMessage;
import com.example.messaging_app.service.ChatService;

@Controller
public class WebSocketController {
    private final ChatService userService;
    public WebSocketController(ChatService userService) {
        this.userService = userService;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public ChatMessage handleUpdates(@Payload ChatMessage message)
    {
        System.out.println("\n" + message);
        return userService.saveMessage(message);
    }
}
