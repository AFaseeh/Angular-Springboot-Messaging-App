package com.example.messaging_app.dto;

import com.example.messaging_app.model.ChatUser;

public record UserAuthResultDto(ChatUser user, AuthValidationError error, String token) {
}

