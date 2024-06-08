package com.rp.expenseapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rp.expenseapi.dto.UserDTO;
import com.rp.expenseapi.model.User;
import com.rp.expenseapi.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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
