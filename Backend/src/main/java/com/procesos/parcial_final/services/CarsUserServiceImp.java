package com.procesos.parcial_final.services;

import com.procesos.parcial_final.models.CarsUser;
import com.procesos.parcial_final.models.User;
import com.procesos.parcial_final.repository.CarsUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarsUserServiceImp implements CarsUsersService {

    @Autowired
    CarsUserRepository carsUserRepository;

    @Override
    public Boolean saveCarsUsers(CarsUser carsUser) {
        try{
            carsUserRepository.save(carsUser);
            return true;
        }catch(Exception e){
            System.out.println(e);
            return false;
        }
    }

    @Override
    public Boolean updateCarsUsers(Long id, CarsUser carsUser) {
        try{
            CarsUser carsUserBD = carsUserRepository.findById(id).get();
            carsUserBD.setCarsId(carsUser.getCarsId());
            carsUserBD.setUserId(carsUser.getUserId());
            carsUserRepository.save(carsUserBD);
            return true;
        }catch (Exception e){
            System.out.println(e);
            return false;
        }
    }

    @Override
    public List<CarsUser> getCarsUsers(User user){
        try {
            return carsUserRepository.findByUserId(user);
        }catch(Exception e){
            System.out.println(e);
            return null;
        }
    }

    @Override
    public List<CarsUser> allCarsUsers() {
        return carsUserRepository.findAll();
    }
}
