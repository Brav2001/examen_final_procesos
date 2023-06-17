package com.procesos.parcial_1.services;

import com.procesos.parcial_1.models.Cars;

import java.util.List;

public interface CarsService {

    Boolean saveCars();

    Boolean updateCars (Long id, Cars cars);

    Boolean updateCarsAvailability (Long id);

    Cars getCars(Long id);

    List <Cars> allCars();

}
