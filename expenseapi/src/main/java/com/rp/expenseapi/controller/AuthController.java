package com.rp.expenseapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rp.expenseapi.dto.UserDTO;
import com.rp.expenseapi.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    private UserDTO signUp (@RequestBody UserDTO newUserDto) {
        UserDTO newUser = userService.createUser(newUserDto);
        return newUser;
    }
}
