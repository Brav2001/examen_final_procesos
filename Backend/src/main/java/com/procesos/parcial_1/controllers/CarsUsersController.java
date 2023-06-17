package com.procesos.parcial_1.controllers;

import com.procesos.parcial_1.models.Cars;
import com.procesos.parcial_1.models.CarsUser;
import com.procesos.parcial_1.models.User;
import com.procesos.parcial_1.services.CarsUsersService;
import com.procesos.parcial_1.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class CarsUsersController {
    @Autowired
    CarsUsersService carsUsersService;
    @Autowired
    UserService userService;

    @PostMapping("/saveCarsUser")
    public ResponseEntity saveCarsUsers(@RequestHeader(value="Authorization") String token, @RequestBody CarsUser carsUser) {
        Map response = new HashMap();
        if(!userService.Auth(token.substring(7))){
            response.put("status", "401");
            response.put("message", "Token invalido");
            return new ResponseEntity(response, HttpStatus.UNAUTHORIZED);
        }
        boolean res= carsUsersService.saveCarsUsers(carsUser);

        if(res==true){
            response.put("status", "201");
            response.put("message", "Se registraron todos los carros");
            return new ResponseEntity(response,HttpStatus.CREATED);
        }else {
            response.put("status", "500");
            response.put("message", "No se registraron los carro");
            return new ResponseEntity(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping(value = "/updateCarsUser/{id}")
    public ResponseEntity updateCarsUser(@RequestHeader(value="Authorization") String token,@PathVariable Long id,@RequestBody CarsUser carsUser){
        Map response = new HashMap();
        if(!userService.Auth(token.substring(7))){
            response.put("status", "401");
            response.put("message", "Token invalido");
            return new ResponseEntity(response, HttpStatus.UNAUTHORIZED);
        }
        Boolean res = carsUsersService.updateCarsUsers(id,carsUser);

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



    @PostMapping(value = "/carsUser")
    public ResponseEntity findCarsUserById(@RequestHeader(value="Authorization") String token,@RequestBody User user){
        System.out.println(user.getId());
        Map response = new HashMap();
        try{
            if(!userService.Auth(token.substring(7))) {
                response.put("status", "401");
                response.put("message", "Token invalido");
                return new ResponseEntity(response, HttpStatus.UNAUTHORIZED);
            }
            response.put("status", "201");
            if(carsUsersService.getCarsUsers(user).isEmpty()==false) {
                response.put("data", carsUsersService.getCarsUsers(user));
            }else {
                response.put("data", null);
            }
            return new ResponseEntity(response, HttpStatus.OK);
        }catch(Exception e) {
            response.put("status", "404");
            response.put("message", "No se encontro el carro");
            return new ResponseEntity(response, HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping(value = "/carsUsersAll" )
    public ResponseEntity CarsUser(@RequestHeader(value="Authorization") String token){

        Map response = new HashMap();
        try{
            if(!userService.Auth(token.substring(7))){
                response.put("status", "401");
                response.put("message", "Token invalido");
                return new ResponseEntity(response, HttpStatus.UNAUTHORIZED);
            }
            return new ResponseEntity(carsUsersService.allCarsUsers(), HttpStatus.OK) ;
        }catch(Exception e) {
            response.put("status", "404");
            response.put("message", "No hay carros");
            return new ResponseEntity(response, HttpStatus.NOT_FOUND);
        }
    }

}
