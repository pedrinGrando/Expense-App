package com.rp.expenseapi.controller;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rp.expenseapi.dto.expense.ExpenseDTO;
import com.rp.expenseapi.dto.limit.ExpenseLimitDTO;
import com.rp.expenseapi.service.ExpenseLimitService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/limit")
public class ExpenseLimitController {

  @Autowired
  private ExpenseLimitService expenseLimitService;

  @GetMapping
  public ResponseEntity<ExpenseLimitDTO> getExpenseLimit(@RequestParam YearMonth date) {
      ExpenseLimitDTO expenseLimit = expenseLimitService.getExpenseLimit(date);
      return ResponseEntity.ok(expenseLimit);
  }

  // @GetMapping("/month-result")
  // public void getMonthResult(@RequestParam Optional<YearMonth> date) {
  // }

  @PostMapping
  public ResponseEntity<ExpenseLimitDTO> createExpenseLimit (@RequestBody ExpenseLimitDTO expenseLimitDTO) {
    ExpenseLimitDTO createdExpenseLimit = expenseLimitService.createExpenseLimit(expenseLimitDTO);
    return new ResponseEntity<>(createdExpenseLimit, HttpStatus.CREATED);
  }

  // @PutMapping
  // public ResponseEntity<ExpenseLimitDTO> updateExpenseLimit (@RequestParam YearMonth date) {
  //   return ResponseEntity.ok(new ExpenseLimitDTO());
  // }
}
