package com.Project.CarRental.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Project.CarRental.entity.Car;
import com.Project.CarRental.repository.CarRepository;

@Service
public class CarService {

    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    // Get all cars
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    // Get car by ID
    public Car getCarById(Long id) {
        return carRepository.findById(id).orElse(null);
    }

    // Add or update car
    public Car saveCar(Car car) {
        return carRepository.save(car);
    }

    // Delete car
    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }
}