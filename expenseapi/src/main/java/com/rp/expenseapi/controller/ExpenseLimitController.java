package com.rp.expenseapi.controller;

import java.time.YearMonth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rp.expenseapi.dto.limit.ExpenseLimitDTO;
import com.rp.expenseapi.dto.limit.MonthResultDTO;
import com.rp.expenseapi.service.ExpenseLimitService;
import com.rp.expenseapi.service.MonthResultService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/limit")
public class ExpenseLimitController {

  @Autowired 
  private MonthResultService monthResultService;

  @Autowired
  private ExpenseLimitService expenseLimitService;

  @GetMapping
  public ResponseEntity<ExpenseLimitDTO> getExpenseLimit(@RequestParam YearMonth date) {
      ExpenseLimitDTO expenseLimit = expenseLimitService.getExpenseLimit(date);
      return ResponseEntity.ok(expenseLimit);
  }

  @GetMapping("/month-result")
  public ResponseEntity<MonthResultDTO> getMonthResult(@RequestParam YearMonth date) {
    MonthResultDTO monthResult = monthResultService.getMonthResult(date);
    return ResponseEntity.ok(monthResult);
  }

  @PostMapping
  public ResponseEntity<ExpenseLimitDTO> createExpenseLimit (@RequestBody ExpenseLimitDTO expenseLimitDTO) {
    ExpenseLimitDTO createdExpenseLimit = expenseLimitService.createExpenseLimit(expenseLimitDTO);
    return new ResponseEntity<>(createdExpenseLimit, HttpStatus.CREATED);
  }

  @PutMapping
  public ResponseEntity<ExpenseLimitDTO> updateExpenseLimit (@RequestParam YearMonth date,  @RequestBody ExpenseLimitDTO expenseLimitDTO) {
    ExpenseLimitDTO updatedExpenseLimit = expenseLimitService.updateExpenseLimit(date, expenseLimitDTO);
    return ResponseEntity.ok(updatedExpenseLimit);
  }
}
