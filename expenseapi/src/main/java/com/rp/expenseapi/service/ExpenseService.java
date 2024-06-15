package com.rp.expenseapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rp.expenseapi.dto.expense.ExpenseDTO;
import com.rp.expenseapi.model.Expense;
import com.rp.expenseapi.repository.ExpenseRepository;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;

    public ExpenseDTO createExpense(ExpenseDTO expense) {
      Expense createdExpense = expenseRepository.save(this.convertToEntity(expense));
      return this.convertToDTO(createdExpense);
    }

    private ExpenseDTO convertToDTO(Expense expense) {
      return ExpenseDTO.builder()
                  .name(expense.getName())
                  .value(expense.getValue())
                  .description(expense.getDescription())
                  .date(expense.getDate()) // Conversão do campo birthDate
                  .build();
    }

    private Expense convertToEntity(ExpenseDTO expenseDTO) {
      return Expense.builder()
                  .name(expenseDTO.getName())
                  .value(expenseDTO.getValue())
                  .description(expenseDTO.getDescription())
                  .date(expenseDTO.getDate())
                  .build();
    }
  
}
