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
        User currentUser = UserUtils.getCurrentUser().orElseThrow(() -> new RuntimeException("User not authenticated"));
        List<Expense> expenses = date.isPresent()
            ? expenseRepository.findByUserAndDate(currentUser, date.get())
            : expenseRepository.findByUser(currentUser);
        return expenses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ExpenseDTO createExpense(ExpenseDTO expenseDTO) {
        Expense newExpense = convertToEntity(expenseDTO);
        newExpense.setUser(UserUtils.getCurrentUser().orElseThrow(() -> new RuntimeException("User not authenticated")));
        Expense createdExpense = expenseRepository.save(newExpense);
        return convertToDTO(createdExpense);
    }

    public ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO) {
        Expense existingExpense = expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found"));
        updateEntityFromDTO(existingExpense, expenseDTO);
        existingExpense.setUser(UserUtils.getCurrentUser().orElseThrow(() -> new RuntimeException("User not authenticated")));
        Expense updatedExpense = expenseRepository.save(existingExpense);
        return convertToDTO(updatedExpense);
    }

    public ExpenseDTO deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found"));
        expenseRepository.deleteById(id);
        return convertToDTO(expense);
    }

    public ExpenseDTO getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found"));
        return convertToDTO(expense);
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
            .build();
    }

    private void updateEntityFromDTO(Expense existingExpense, ExpenseDTO expenseDTO) {
        existingExpense.setName(expenseDTO.getName());
        existingExpense.setValue(expenseDTO.getValue());
        existingExpense.setDescription(expenseDTO.getDescription());
        existingExpense.setDate(expenseDTO.getDate());
    }
}
