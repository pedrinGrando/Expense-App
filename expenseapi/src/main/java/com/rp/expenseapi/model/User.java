package com.rp.expenseapi.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve possuir entre 2 e 100 caracteres")
    @Column(nullable = false, length = 100)
    private String name;

    @Email(message = "Email deve ser válido")
    @NotBlank(message = "Email é obrigatório")
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @NotBlank(message = "Data de nascimento é obrigatório")
    @Column(nullable = false)
    private LocalDate birthDate;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha de possuir no mínimo 6 caracteres")
    @Column(nullable = false, length = 100)
    private String password;

}
