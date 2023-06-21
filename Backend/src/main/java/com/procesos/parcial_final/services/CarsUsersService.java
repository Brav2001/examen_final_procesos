package com.procesos.parcial_final.services;

import com.procesos.parcial_final.models.CarsUser;
import com.procesos.parcial_final.models.User;

import java.util.List;

public interface CarsUsersService {
    Boolean saveCarsUsers(CarsUser carsUser);

    Boolean updateCarsUsers (Long id, CarsUser carsUser);

    List<CarsUser> getCarsUsers(User user);

    List<CarsUser> allCarsUsers();
}
