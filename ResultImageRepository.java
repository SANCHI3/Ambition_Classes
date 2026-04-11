package com.ambition.ambitionbackend.repository;

import com.ambition.ambitionbackend.model.ResultImage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultImageRepository extends MongoRepository<ResultImage, String> {
}