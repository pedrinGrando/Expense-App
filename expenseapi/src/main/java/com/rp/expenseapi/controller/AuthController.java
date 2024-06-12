package com.rp.expenseapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rp.expenseapi.dto.LoginRequestDTO;
import com.rp.expenseapi.dto.UserDTO;
import com.rp.expenseapi.security.JwtResponse;
import com.rp.expenseapi.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signUp(@RequestBody UserDTO newUserDto) {
        try {
            UserDTO newUser = userService.createUser(newUserDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
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
