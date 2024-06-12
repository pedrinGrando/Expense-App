package com.rp.expenseapi.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthenticatedUserDTO {
    String name;
    String email;
}
