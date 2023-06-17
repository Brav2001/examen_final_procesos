package com.procesos.parcial_1.models;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class User {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "first_name", length = 100, nullable = false)
    private String firstName;
    @Column(name = "last_name", length = 100, nullable = false)
    private String lastName;
    @Column(length = 100)
    private String address;
    @Column(length = 100,nullable = false,unique = true)
    private String email;
    @Column(length = 64, nullable = false)
    private String password;
    @Column(length = 30)
    private Date birthday;
}


