package com.rp.expenseapi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String name;
    private String email;
    private String birthDate; // Novo campo adicionado
    private String password;
}
