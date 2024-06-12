package com.rp.expenseapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rp.expenseapi.dto.LoginRequestDTO;
import com.rp.expenseapi.dto.UserDTO;
import com.rp.expenseapi.model.User;
import com.rp.expenseapi.repository.UserRepository;
import com.rp.expenseapi.security.JwtResponse;
import com.rp.expenseapi.security.JwtTokenUtil;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    @Value("${jwt.secret}")
    String secret;
    
    final private AuthenticationManager authenticationManager;
    final private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                             .map(this::convertToDTO)
                             .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                             .map(this::convertToDTO)
                             .orElse(null);
    }

    public UserDTO createUser(UserDTO userDTO) {
        User user = this.convertToEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        UserDTO createdUserDto = this.convertToDTO(userRepository.save(user));
        return createdUserDto;
    }

    public JwtResponse authenticateUser(LoginRequestDTO loginRequestDTO) {
        Optional<User> optionalUser = userRepository.findByEmail(loginRequestDTO.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
                return signin(this.convertToDTO(user));
            }
        }
        return null;
    }

    private JwtResponse signin(UserDTO dto) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
        User user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Email inválido"));
        String jwt = jwtTokenUtil.generateToken(user);
        return JwtResponse.builder()
                          .token(jwt)
                          .message("Login bem-sucedido")
                          .build();
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        return userRepository.findById(id)
                             .map(existingUser -> {
                                 existingUser.setName(userDTO.getName());
                                 existingUser.setEmail(userDTO.getEmail());
                                 existingUser.setPassword(userDTO.getPassword());
                                 existingUser.setBirthDate(userDTO.getBirthDate()); // Atualização do campo birthDate
                                 return convertToDTO(userRepository.save(existingUser));
                             })
                             .orElse(null);
    }

    public boolean deleteUser(Long id) {
        return userRepository.findById(id)
                             .map(user -> {
                                 userRepository.delete(user);
                                 return true;
                             })
                             .orElse(false);
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                      .id(user.getId())
                      .name(user.getName())
                      .email(user.getEmail())
                      .password(user.getPassword())
                      .birthDate(user.getBirthDate()) // Conversão do campo birthDate
                      .build();
    }

    private User convertToEntity(UserDTO userDTO) {
        return User.builder()
                   .id(userDTO.getId())
                   .name(userDTO.getName())
                   .email(userDTO.getEmail())
                   .password(userDTO.getPassword())
                   .birthDate(userDTO.getBirthDate()) // Conversão do campo birthDate
                   .build();
    }
}
