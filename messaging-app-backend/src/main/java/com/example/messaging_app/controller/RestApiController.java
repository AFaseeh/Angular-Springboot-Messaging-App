package com.example.messaging_app.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.messaging_app.dto.UserAuthResultDto;
import com.example.messaging_app.dto.UserLoginInfoDto;
import com.example.messaging_app.model.ChatMessage;
import com.example.messaging_app.service.ChatService;
import com.example.messaging_app.service.UserService;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class RestApiController {

    private final UserService userService;
    private final ChatService chatService;

    RestApiController(ChatService chatService, UserService userService) {
        this.chatService = chatService;
        this.userService = userService;
    }

    @PostMapping("/register/{name}")
    public UserAuthResultDto CreateNewUser(@PathVariable String name, @Validated @RequestBody UserLoginInfoDto userLogin) 
    {
        return userService.registerNewUser(name, userLogin);
    }

    @GetMapping("/login")
    public UserAuthResultDto getMethodName(@Validated @RequestBody UserLoginInfoDto userLogin) {
        return userService.getUserFromLogin(userLogin);
    }
    

    @GetMapping("/chat/messages")
    public List<ChatMessage> getMessages() {
        return chatService.getMessages();
    }
    
}
