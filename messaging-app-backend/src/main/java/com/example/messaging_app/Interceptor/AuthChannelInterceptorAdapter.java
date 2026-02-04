package com.example.messaging_app.interceptor;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.example.messaging_app.service.JwtService;
import com.example.messaging_app.service.MyUserDetailsService;

@Component
public class AuthChannelInterceptorAdapter implements ChannelInterceptor {

    private final MyUserDetailsService myUserDetailsService;

    private final JwtService jwtService;

    public AuthChannelInterceptorAdapter(JwtService jwtService, MyUserDetailsService myUserDetailsService) {
        this.jwtService = jwtService;
        this.myUserDetailsService = myUserDetailsService;
    }

    @Override
    public Message<?> preSend(final Message<?> message, final MessageChannel channel) {
        final StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) {
            return message;
        }

        if (StompCommand.CONNECT == accessor.getCommand()) {
            final String authorizationHeader = accessor.getFirstNativeHeader("Authorization");

            if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String username = jwtService.extractUserName(token);

                if (username != null) {
                    UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);
                    if (jwtService.validateToken(token, userDetails)) {
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        accessor.setUser(auth); // Set user in the accessor so it persists for the session
                        SecurityContextHolder.getContext().setAuthentication(auth); // Set for the current thread
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }
        } else if (accessor.getUser() != null) {
            UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) accessor.getUser();
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        return message;
    }
}