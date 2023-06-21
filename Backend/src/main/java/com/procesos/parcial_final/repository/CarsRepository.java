package com.procesos.parcial_final.repository;

import com.procesos.parcial_final.models.Cars;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarsRepository extends JpaRepository <Cars, Long> {
}
