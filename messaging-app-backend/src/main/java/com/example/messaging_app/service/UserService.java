package com.example.messaging_app.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.messaging_app.dto.AuthValidationError;
import com.example.messaging_app.dto.UserLoginInfoDto;
import com.example.messaging_app.dto.UserAuthResultDto;
import com.example.messaging_app.model.ChatUser;
import com.example.messaging_app.repo.UserRepo;

@Service
public class UserService {
    private final JwtService jwtService;
    private final UserRepo userRepo;
    private final PasswordEncoder encoder;

    public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepo = userRepo;
        this.encoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UserAuthResultDto registerNewUser(String name, UserLoginInfoDto userLogin) {
        ChatUser user = null;
        final String displayName = name.trim();
        final String username = userLogin.username().toLowerCase().trim();
        final String encodedPass = encoder.encode(userLogin.password().trim());

        if (userRepo.findByUserName(username).isPresent()) {
            return new UserAuthResultDto(user, new AuthValidationError("UserName", "User Name Exists"), null);
        }

        user = userRepo.save(new ChatUser(null, displayName, username, encodedPass));

        var token = this.jwtService.generateToken(username);
        return new UserAuthResultDto(user, null, token);
    }

    public UserAuthResultDto getUserDtoFromLogin(UserLoginInfoDto userLogin) {
        final String username = userLogin.username().trim();
        final String pass = userLogin.password().trim();
        var foundUser = userRepo.findByUserName(username);

        if (!foundUser.isPresent()) {
            return new UserAuthResultDto(null, new AuthValidationError("UserName", "User Name Not Found"), null);
        } else

        if (encoder.matches(pass, foundUser.get().getPassword())) {
            return new UserAuthResultDto(null, new AuthValidationError("Password", "Password is incorrect"), null);
        }

        var token = this.jwtService.generateToken(username);
        return new UserAuthResultDto(foundUser.get(), null, token);
    }
}
