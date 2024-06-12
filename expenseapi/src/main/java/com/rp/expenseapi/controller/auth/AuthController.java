package com.rp.expenseapi.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rp.expenseapi.dto.auth.LoginRequestDTO;
import com.rp.expenseapi.dto.auth.NewUserDTO;
import com.rp.expenseapi.dto.user.UserDTO;
import com.rp.expenseapi.security.JwtResponse;
import com.rp.expenseapi.service.user.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<NewUserDTO> signUp(@RequestBody UserDTO newUserDto) {
        try {
            UserDTO createdUser = userService.createUser(newUserDto);
            return ResponseEntity.status(HttpStatus.CREATED)
            .body(new NewUserDTO(createdUser.getName(), createdUser.getEmail(), createdUser.getBirthDate()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); 
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequestDTO loginRequest) {
        try {
            JwtResponse jwtResponse = userService.authenticateUser(loginRequest);
            if (jwtResponse == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha incorretos.");
            }
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro no servidor: " + e.getMessage());
        }
    }
    

    
}
