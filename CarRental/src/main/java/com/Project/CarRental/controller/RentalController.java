package com.Project.CarRental.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.Project.CarRental.entity.Rental;
import com.Project.CarRental.service.RentalService;

@RestController
@RequestMapping("/rentals")
@CrossOrigin(origins = "*")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    // Get all rentals
    @GetMapping
    public List<Rental> getAllRentals() {
        return rentalService.getAllRentals();
    }

    // Get rental by ID
    @GetMapping("/{id}")
    public Rental getRentalById(@PathVariable Long id) {
        return rentalService.getRentalById(id);
    }

    // Add rental
    @PostMapping
    public Rental addRental(@RequestBody Rental rental) {
        return rentalService.saveRental(rental);
    }

    // Update rental
    @PutMapping("/{id}")
    public Rental updateRental(@PathVariable Long id, @RequestBody Rental rental) {
        rental.setRentalId(id);
        return rentalService.saveRental(rental);
    }

    // Delete rental
    @DeleteMapping("/{id}")
    public String deleteRental(@PathVariable Long id) {
        rentalService.deleteRental(id);
        return "Rental deleted successfully";
    }
}