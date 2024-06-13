package com.rp.expenseapi.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthenticatedUserDTO {
    private String name;
    private String email;
}
