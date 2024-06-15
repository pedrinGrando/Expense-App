package com.rp.expenseapi.dto.limit;

import java.math.BigDecimal;
import java.time.YearMonth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseLimitDTO {
    private BigDecimal value ;
    private YearMonth date;
    private Long userId;
}
