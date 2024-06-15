package com.rp.expenseapi.dto.expense;

import java.math.BigDecimal;
import java.time.YearMonth;

import com.rp.expenseapi.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpenseDTO {
  private Long id;
  private String name;
  private BigDecimal value;
  private String description;
  private YearMonth date;
}
