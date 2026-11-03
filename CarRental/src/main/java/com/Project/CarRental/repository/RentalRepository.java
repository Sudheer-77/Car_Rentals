package com.Project.CarRental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Project.CarRental.entity.Rental;

public interface RentalRepository extends JpaRepository<Rental, Long> {

}