package com.ambition.ambitionbackend.controller;

import com.ambition.ambitionbackend.model.Attendance;
import com.ambition.ambitionbackend.model.Student;
import com.ambition.ambitionbackend.repository.AttendanceRepository;
import com.ambition.ambitionbackend.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    // ✅ SAVE / UPDATE ATTENDANCE
    @PostMapping
    public ResponseEntity<?> add(@RequestBody Attendance a) {

        if (a.getStudentMobile() == null || a.getStudentMobile().isEmpty()) {
            return ResponseEntity.badRequest().body("Student mobile missing");
        }

        Student s = studentRepository.findByStudentMobile(a.getStudentMobile());

        if (s == null) {
            return ResponseEntity.badRequest().body("Student not found");
        }

        List<Attendance> existing =
                attendanceRepository.findByStudentMobileAndDate(
                        a.getStudentMobile(), a.getDate()
                );

        if (!existing.isEmpty()) {
            Attendance old = existing.get(0);
            old.setStatus(a.getStatus());
            return ResponseEntity.ok(attendanceRepository.save(old));
        }

        a.setName(s.getName());
        a.setClassName(s.getClassName());
        a.setStudentMobile(s.getStudentMobile());

        return ResponseEntity.ok(attendanceRepository.save(a));
    }

    // ✅ GET ALL
    @GetMapping
    public List<Attendance> getAll() {
        return attendanceRepository.findAll();
    }

    // ✅ GET BY STUDENT
    @GetMapping("/student/{mobile}")
    public List<Attendance> getByStudent(@PathVariable String mobile){
        return attendanceRepository.findByStudentMobile(mobile);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        attendanceRepository.deleteById(id);
    }

    // ✅ UPDATE
    // GET attendance by ID
    @GetMapping("/{id}")
    public Attendance getById(@PathVariable String id){
        return attendanceRepository.findById(id).orElse(null);
    }

    // UPDATE attendance
    @PutMapping("/{id}")
    public Attendance update(@PathVariable String id, @RequestBody Attendance updated){

        Attendance existing = attendanceRepository.findById(id).orElse(null);

        if(existing == null) return null;

        existing.setDate(updated.getDate());
        existing.setStatus(updated.getStatus());

        return attendanceRepository.save(existing);
    }
}