package com.rp.expenseapi.dto.auth;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data 
@AllArgsConstructor
public class NewUserDTO {
    private String name;
    private String email;
}
