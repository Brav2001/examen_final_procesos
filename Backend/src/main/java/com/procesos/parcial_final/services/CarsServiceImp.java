package com.procesos.parcial_final.services;

import com.procesos.parcial_final.models.Cars;
import com.procesos.parcial_final.models.CarsApi;
import com.procesos.parcial_final.repository.CarsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CarsServiceImp implements CarsService{
    private final RestTemplate restTemplate;

    @Autowired
    public CarsServiceImp(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    @Autowired
    private CarsRepository carsRepository;
    @Override
    public Boolean saveCars() {
        try{
            String url="https://myfakeapi.com/api/cars/";
            CarsApi carsApi = restTemplate.getForObject(url, CarsApi.class);
            Map response = new HashMap();
            int contador=0;
            int registrado=0;
            for (Cars cars : carsApi.getCars()) {
                contador++;
                try{
                    carsRepository.save(cars);
                    registrado++;
                }catch (Exception e){}
            }
            if(contador==registrado){
                return true;
            }else{
                return false;
            }
        }catch(Exception e){
            return false;
        }
    }
    public Cars getCars(Long id){

        return carsRepository.findById(id).get();
    }

    @Override
    public List<Cars> allCars() {
        return carsRepository.findAll();
    }

    @Override
    public Boolean updateCars(Long id, Cars cars) {
        try{
            Cars carsBD = carsRepository.findById(id).get();
            carsBD.setCar(cars.getCar());
            carsBD.setCar_color(cars.getCar_color());
            carsBD.setCar_price(cars.getCar_price());
            carsBD.setCar_vin(cars.getCar_vin());
            carsBD.setAvailability(cars.getAvailability());
            carsBD.setCar_model(cars.getCar_model());
            carsBD.setCar_model_year(cars.getCar_model_year());
            carsRepository.save(carsBD);
            return true;
        }catch (Exception e){
            return false;
        }
    }

    @Override
    public Boolean updateCarsAvailability(Long id) {
        try{
            Cars carsBD = carsRepository.findById(id).get();
            carsBD.setAvailability(false);
            carsRepository.save(carsBD);
            return true;
        }catch (Exception e){
            return false;
        }
    }

}
