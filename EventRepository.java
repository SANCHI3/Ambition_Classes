package com.ambition.ambitionbackend.repository;

import com.ambition.ambitionbackend.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EventRepository extends MongoRepository<Event, String> {
}