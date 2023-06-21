package com.procesos.parcial_final.models;

import lombok.Data;

import java.util.List;

@Data
public class CarsApi {
    private List<Cars> cars;

    public List<Cars> getCars() {
        return cars;
    }

    public void setCars(List<Cars> cars) {
        this.cars = cars;
    }
}
