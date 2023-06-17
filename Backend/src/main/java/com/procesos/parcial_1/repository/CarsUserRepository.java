package com.procesos.parcial_1.repository;

import com.procesos.parcial_1.models.CarsUser;
import com.procesos.parcial_1.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarsUserRepository extends JpaRepository<CarsUser, Long> {
    List<CarsUser> findByUserId (User userId);
}
