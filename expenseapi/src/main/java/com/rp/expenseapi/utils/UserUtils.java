package com.rp.expenseapi.utils;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.rp.expenseapi.model.User;

public class UserUtils {
    public static Optional<Long> getCurrentUserId() {
      if (SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof User) {
        Optional<Authentication> authentication = Optional.ofNullable(
          SecurityContextHolder.getContext().getAuthentication());
      if (authentication.isPresent()) {
        return Optional.of(((User) authentication.get().getPrincipal()).getId());
      }
    }
    return Optional.empty();
  }

  public static Optional<User> getCurrentUser() {
    if (SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof User) {
      return Optional.of(
          (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }
    return Optional.empty();
  }
}
