package com.rp.expenseapi.repository;

import java.time.YearMonth;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rp.expenseapi.model.Expense;
import com.rp.expenseapi.model.User;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserAndDate(User user, YearMonth date);
    List<Expense> findByUser(User user);
}
