package com.ambition.ambitionbackend.repository;

import com.ambition.ambitionbackend.model.Test;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TestRepository extends MongoRepository<Test, String> {
}
