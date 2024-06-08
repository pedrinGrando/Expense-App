package com.rp.expenseapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rp.expenseapi.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
