package com.procesos.parcial_1.models;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class CarsUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "carsId", unique = true)
    private Cars carsId;

    @ManyToOne()
    @JoinColumn(name="userId")
    private User userId;
}
