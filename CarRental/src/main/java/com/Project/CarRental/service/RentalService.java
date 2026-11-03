package com.Project.CarRental.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Project.CarRental.entity.Rental;
import com.Project.CarRental.repository.RentalRepository;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;

    public RentalService(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    // Get all rentals
    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    // Get rental by ID
    public Rental getRentalById(Long id) {
        return rentalRepository.findById(id).orElse(null);
    }

    // Add or update rental
    public Rental saveRental(Rental rental) {
        return rentalRepository.save(rental);
    }

    // Delete rental
    public void deleteRental(Long id) {
        rentalRepository.deleteById(id);
    }
}