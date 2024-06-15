package com.rp.expenseapi.dto.limit;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthResultDTO {
  private boolean isSavingsAchieved;
  private BigDecimal expensesSum;
  private BigDecimal expenseLimit;
}
