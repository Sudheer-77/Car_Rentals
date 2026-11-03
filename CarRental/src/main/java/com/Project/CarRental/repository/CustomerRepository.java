package com.Project.CarRental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Project.CarRental.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}