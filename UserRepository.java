package com.ambition.ambitionbackend.repository;

import com.ambition.ambitionbackend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {

    User findByUsername(String username);

    List<User> findByRole(String role);  // ✅ ADD THIS
}