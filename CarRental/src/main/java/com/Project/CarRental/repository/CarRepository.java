package com.Project.CarRental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Project.CarRental.entity.Car;

public interface CarRepository extends JpaRepository<Car, Long> {

}