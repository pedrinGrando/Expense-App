package com.rp.expenseapi.service;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rp.expenseapi.dto.expense.ExpenseDTO;
import com.rp.expenseapi.model.Expense;
import com.rp.expenseapi.model.User;
import com.rp.expenseapi.repository.ExpenseRepository;
import com.rp.expenseapi.utils.UserUtils;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;

    public List<ExpenseDTO> getAllExpenses(Optional<YearMonth> date) {
      User currentUser = UserUtils.getCurrentUser().get();
      System.out.println(date);
      List<Expense> expenses = date.isPresent() 
      ? expenseRepository.findByUserAndDate(currentUser, date.get()) 
      : expenseRepository.findByUser(currentUser);
      return expenses.stream().map(this::convertToDTO).collect(Collectors.toList());
  }

    public ExpenseDTO createExpense(ExpenseDTO expense) {
      expense.setUser(UserUtils.getCurrentUser().get());
      Expense createdExpense = expenseRepository.save(this.convertToEntity(expense));
      return this.convertToDTO(createdExpense);
    }

    private ExpenseDTO convertToDTO(Expense expense) {
      return ExpenseDTO.builder()
                  .id(expense.getId())
                  .name(expense.getName())
                  .value(expense.getValue())
                  .description(expense.getDescription())
                  .date(expense.getDate())
                  .build();
    }

    private Expense convertToEntity(ExpenseDTO expenseDTO) {
      return Expense.builder()
                  .id(expenseDTO.getId())
                  .name(expenseDTO.getName())
                  .value(expenseDTO.getValue())
                  .description(expenseDTO.getDescription())
                  .date(expenseDTO.getDate())
                  .user(expenseDTO.getUser())
                  .build();
    }
  
}
