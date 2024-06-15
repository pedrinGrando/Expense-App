package com.rp.expenseapi.repository;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rp.expenseapi.model.Expense;
import com.rp.expenseapi.model.User;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserAndDate(User user, YearMonth date);
    List<Expense> findByUser(User user);

    @Query("SELECT SUM(e.value) FROM Expense e WHERE e.user = :user AND e.date = :date")
    BigDecimal sumTotalExpenseValuesForUserByMonth(@Param("user") User user, @Param("date") YearMonth date);
}
