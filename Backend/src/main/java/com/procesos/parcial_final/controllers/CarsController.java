package com.procesos.parcial_final.controllers;

import com.procesos.parcial_final.models.Cars;
import com.procesos.parcial_final.services.CarsServiceImp;
import com.procesos.parcial_final.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController

public class CarsController {
    private final RestTemplate restTemplate;
    @Autowired
    public CarsController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    @Autowired
    CarsServiceImp carsServiceImp;

    @Autowired
    UserService userService;

    /* METODO GUARDAR CARROS CREATE */

    @GetMapping("/saveCars")
    public ResponseEntity saveCars(@RequestHeader(value="Authorization") String token) {
        Map response = new HashMap();
        if(!userService.Auth(token.substring(7))){
            response.put("status", "401");
            response.put("message", "Token invalido");
            return new ResponseEntity(response, HttpStatus.UNAUTHORIZED);
        }
        boolean res= carsServiceImp.saveCars();

        if(res==true){
            response.put("status", "201");
            response.put("message", "Se registraron todos los carros");
            return new ResponseEntity(response,HttpStatus.CREATED);
        }else{
            response.put("status", "500");
            response.put("message", "No se registraron los carro");
            return new ResponseEntity(response,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /* METODO ACTUALIZAR CARROS POR ID UPDATEBYID*/
    @PutMapping(value = "/updateCar/{id}")
    public ResponseEntity updateCar(@RequestHeader(value="Authorization") String token,@PathVariable Long id,@RequestBody Cars cars){
        Map response = new HashMap();
        if(!userService.Auth(token.substring(7))){
            response.put("status", "401");
            response.put("message", "Token invalido");
            return new ResponseEntity(response, HttpStatus.UNAUTHORIZED);
        }
        Boolean res = carsServiceImp.updateCars(id,cars);

        if(res==true){
            response.put("status", "200");
            response.put("message", "Se actualizó el carro");
            return new ResponseEntity(response, HttpStatus.OK) ;
        }else{
            response.put("status", "400");
            response.put("message", "No se actualizó el carro");
            return new ResponseEntity(response, HttpStatus.BAD_REQUEST);
        }

    }

    /* METODO CONSULTAR CARROS POR ID GETBYID */

    @GetMapping(value = "/cars/{id}")
    public ResponseEntity findCarsById(@RequestHeader(value="Authorization") String token,@PathVariable Long id){

        Map response = new HashMap();
        try{
            if(!userService.Auth(token.substring(7))){
                response.put("status", "401");
                response.put("message", "Token invalido");
                return new ResponseEntity(response, HttpStatus.UNAUTHORIZED);
            }
            return new ResponseEntity(carsServiceImp.getCars(id), HttpStatus.OK) ;
        }catch(Exception e) {
            response.put("status", "404");
            response.put("message", "No se encontro el carro");
            return new ResponseEntity(response, HttpStatus.NOT_FOUND);
        }
    }

    /* METODO CONSULTAR TODOS LOS CARROS GETALL */

    @GetMapping(value = "/cars" )
    public ResponseEntity Cars(@RequestHeader(value="Authorization") String token){

        Map response = new HashMap();
        try{
            System.out.println(token);
            if(!userService.Auth(token.substring(7))){
                response.put("status", "401");
                response.put("message", "Token invalido");
                return new ResponseEntity(response, HttpStatus.UNAUTHORIZED);
            }
            if(carsServiceImp.allCars().isEmpty()==false){
                response.put("data", carsServiceImp.allCars());
            }
            else{
                response.put("data", null);
            }
            return new ResponseEntity(response, HttpStatus.OK) ;
        }catch(Exception e) {
            response.put("status", "404");
            response.put("message", "No hay carros");
            return new ResponseEntity(response, HttpStatus.NOT_FOUND);
        }
    }

    /* METODO ACTUALIZAR CARROS DISPONIBLES POR ID UPDATEBYID*/
    @PutMapping(value = "/updateCarAvailability/{id}")
    public ResponseEntity updateCarAvailability(@RequestHeader(value="Authorization") String token,@PathVariable Long id){
        Map response = new HashMap();
        if(!userService.Auth(token.substring(7))){
            response.put("status", "401");
            response.put("message", "Token invalido");
            return new ResponseEntity(response, HttpStatus.UNAUTHORIZED);
        }
        Boolean res = carsServiceImp.updateCarsAvailability(id);

        if(res==true){
            response.put("status", "200");
            response.put("message", "Se actualizó el carro");
            return new ResponseEntity(response, HttpStatus.OK) ;
        }else{
            response.put("status", "400");
            response.put("message", "No se actualizó el carro");
            return new ResponseEntity(response, HttpStatus.BAD_REQUEST);
        }

    }
}
