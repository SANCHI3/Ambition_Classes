package com.ambition.ambitionbackend.service;

import com.ambition.ambitionbackend.model.Student;
import com.ambition.ambitionbackend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repository;

    public Student save(Student student) {
        return repository.save(student);
    }

    public List<Student> getAll() {
        return repository.findAll();
    }

    public Student getById(String id) {   // ✅ ADD THIS
        return repository.findById(id).orElse(null);
    }
    public Student getByMobile(String mobile) {
        return repository.findByStudentMobile(mobile);
    }
    public void delete(String id) {
        repository.deleteById(id);
    }
}