package com.rp.expenseapi.repository;

import java.time.YearMonth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rp.expenseapi.model.ExpenseLimit;
import com.rp.expenseapi.model.User;

@Repository
public interface ExpenseLimitRepository extends JpaRepository<ExpenseLimit, Long> {
  ExpenseLimit findByUserAndDate(User user, YearMonth date);
}
