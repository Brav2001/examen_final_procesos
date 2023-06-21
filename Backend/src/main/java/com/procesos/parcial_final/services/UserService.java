package com.procesos.parcial_final.services;



import com.procesos.parcial_final.models.User;

import java.util.List;

public interface UserService {
    User getUser(Long id);

    User getUserEmail(String email);
    Boolean createUser(User user );
    List <User> allUsers();
    Boolean updateUser (Long id, User user);
    String login (User user);

    Boolean Auth (String token);
}
