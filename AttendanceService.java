package com.ambition.ambitionbackend.service;

import com.ambition.ambitionbackend.model.Attendance;
import com.ambition.ambitionbackend.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository repository;

    public Attendance save(Attendance attendance) {
        return repository.save(attendance);
    }

    public List<Attendance> getAll() {
        return repository.findAll();
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public Attendance getById(String id) {
        return repository.findById(id).orElse(null);
    }
}