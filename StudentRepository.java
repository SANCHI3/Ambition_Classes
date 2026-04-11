package com.ambition.ambitionbackend.repository;

import com.ambition.ambitionbackend.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StudentRepository extends MongoRepository<Student, String> {
    Student findByStudentMobile(String studentMobile);;
    void deleteByStudentMobile(String studentMobile);
}