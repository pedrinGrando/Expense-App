package com.rp.expenseapi.service;

import java.time.YearMonth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rp.expenseapi.dto.limit.ExpenseLimitDTO;
import com.rp.expenseapi.model.ExpenseLimit;
import com.rp.expenseapi.model.User;
import com.rp.expenseapi.repository.ExpenseLimitRepository;
import com.rp.expenseapi.utils.UserUtils;

@Service
public class ExpenseLimitService {

  @Autowired
  private ExpenseLimitRepository expenseLimitRepository;

  public ExpenseLimitDTO createExpenseLimit (ExpenseLimitDTO expenseLimitDTO) {
    ExpenseLimit newExpenseLimit = convertToEntity(expenseLimitDTO);
    newExpenseLimit.setUser(UserUtils.getCurrentUser().orElseThrow(() -> new RuntimeException("User not authenticated")));
    ExpenseLimit createdExpenseLimit = expenseLimitRepository.save(newExpenseLimit);
    return convertToDTO(createdExpenseLimit);
  }

  public ExpenseLimitDTO getExpenseLimit(YearMonth date) {
    User currentUser = UserUtils.getCurrentUser().orElseThrow(() -> new RuntimeException("User not authenticated"));
    ExpenseLimit expenseLimit = expenseLimitRepository.findByUserAndDate(currentUser, date);
    return convertToDTO(expenseLimit);
  }

  public ExpenseLimitDTO updateExpenseLimit(YearMonth date, ExpenseLimitDTO expenseLimitDTO) {
    User currentUser = UserUtils.getCurrentUser().orElseThrow(() -> new RuntimeException("User not authenticated"));
    ExpenseLimit existingExpenseLimit = expenseLimitRepository.findByUserAndDate(currentUser, date);
    existingExpenseLimit.setUser(currentUser);
    existingExpenseLimit.setValue(expenseLimitDTO.getValue());
    ExpenseLimit updatedExpense = expenseLimitRepository.save(existingExpenseLimit);
    return convertToDTO(updatedExpense);
  }

  private ExpenseLimitDTO convertToDTO(ExpenseLimit expenseLimit) {
    return ExpenseLimitDTO.builder()
                  .id(expenseLimit.getId())
                  .value(expenseLimit.getValue())
                  .date(expenseLimit.getDate())
                  .build();
    }

    private ExpenseLimit convertToEntity(ExpenseLimitDTO expenseLimitDTO) {
        return ExpenseLimit.builder()
                  .id(expenseLimitDTO.getId())
                  .value(expenseLimitDTO.getValue())
                  .date(expenseLimitDTO.getDate())
                  .build();
    }
  
}
