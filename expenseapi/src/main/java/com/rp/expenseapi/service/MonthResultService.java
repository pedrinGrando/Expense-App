package com.rp.expenseapi.service;

import java.math.BigDecimal;
import java.time.YearMonth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rp.expenseapi.dto.limit.MonthResultDTO;
import com.rp.expenseapi.model.User;
import com.rp.expenseapi.repository.ExpenseRepository;
import com.rp.expenseapi.utils.UserUtils;

@Service
public class MonthResultService {

    private static final int EXPENSE_COMPARISON_THRESHOLD = 0;
    
    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ExpenseLimitService expenseLimitService;

    public MonthResultDTO getMonthResult(YearMonth date) {
    User currentUser = UserUtils.getCurrentUser().orElseThrow(() -> new RuntimeException("User not authenticated"));
    BigDecimal expenseLimitValue = expenseLimitService.getExpenseLimit(date).getValue();
    BigDecimal expensesSum = expenseRepository.sumTotalExpenseValuesForUserByMonth(currentUser, date);
    if (expensesSum == null) {
      expensesSum = BigDecimal.ZERO; // Considera que não há despesas se o retorno for nulo
    }
    int comparisonResult = expensesSum.compareTo(expenseLimitValue);
    return new MonthResultDTO(comparisonResult <= EXPENSE_COMPARISON_THRESHOLD, expensesSum, expenseLimitValue);
  }
  
}
