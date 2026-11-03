package com.Project.CarRental.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.Project.CarRental.entity.Car;
import com.Project.CarRental.service.CarService;

@RestController
@RequestMapping("/cars")
@CrossOrigin(origins = "*")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    // Get all cars
    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    // Get car by ID
    @GetMapping("/{id}")
    public Car getCarById(@PathVariable Long id) {
        return carService.getCarById(id);
    }

    // Add a new car
    @PostMapping
    public Car addCar(@RequestBody Car car) {
        return carService.saveCar(car);
    }

    // Update car
    @PutMapping("/{id}")
    public Car updateCar(@PathVariable Long id, @RequestBody Car car) {
        car.setCarId(id);
        return carService.saveCar(car);
    }

    // Delete car
    @DeleteMapping("/{id}")
    public String deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return "Car deleted successfully";
    }
}