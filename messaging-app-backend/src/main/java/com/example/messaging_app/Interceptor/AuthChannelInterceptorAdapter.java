package com.example.messaging_app.Interceptor;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.example.messaging_app.service.WebSocketAuthenticatorService;

@Component
public class AuthChannelInterceptorAdapter implements ChannelInterceptor {

    private final WebSocketAuthenticatorService webSocketAuthenticatorService;

    public AuthChannelInterceptorAdapter(final WebSocketAuthenticatorService webSocketAuthenticatorService) {
        this.webSocketAuthenticatorService = webSocketAuthenticatorService;
    }

    @Override
    public Message<?> preSend(final Message<?> message, final MessageChannel channel) throws AuthenticationException {
        final StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null) {

            if (StompCommand.CONNECT == accessor.getCommand()) {
                final String authorizationHeader = accessor.getFirstNativeHeader("Authorization");

                if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith("Basic ")) {
                    String base64Credentials = authorizationHeader.substring("Basic ".length());
                    byte[] decodedBytes = Base64.getDecoder().decode(base64Credentials);
                    String credentials = new String(decodedBytes, StandardCharsets.UTF_8);

                    final String[] parts = credentials.split(":", 2);
                    if (parts.length >= 2) {
                        final String username = parts[0];
                        final String password = parts[1];

                        UsernamePasswordAuthenticationToken user = webSocketAuthenticatorService
                                .getAuthenticatedOrFail(username, password);
                        accessor.setUser(user);
                        SecurityContextHolder.getContext().setAuthentication(user);
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            } else if (accessor.getUser() != null) {
                UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) accessor.getUser();
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        return message;
    }
}