package com.ambition.ambitionbackend.controller;

import com.ambition.ambitionbackend.model.Result;
import com.ambition.ambitionbackend.model.Student;
import com.ambition.ambitionbackend.repository.ResultRepository;

import com.ambition.ambitionbackend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin
public class ResultController {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping
    public List<Result> getAll() {
        return resultRepository.findAll();
    }

    @GetMapping("/student/{mobile}")
    public List<Result> getByStudent(@PathVariable String mobile){
        return resultRepository.findByStudentMobile(mobile);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        resultRepository.deleteById(id);
    }
    @PostMapping
    public ResponseEntity<?> save(@RequestBody Result result){

        if(result.getStudentMobile() == null || result.getStudentMobile().isEmpty()){
            return ResponseEntity.badRequest().body("Student mobile required");
        }

        Student s = studentRepository.findByStudentMobile(result.getStudentMobile());

        if(s == null){
            return ResponseEntity.badRequest().body("Student not found");
        }

        result.setName(s.getName());
        result.setClassName(s.getClassName());
        result.setStudentMobile(s.getStudentMobile()); // 🔥 MOST IMPORTANT

        return ResponseEntity.ok(resultRepository.save(result));
    }
    @GetMapping("/{id}")
    public Result getById(@PathVariable String id){
        return resultRepository.findById(id).orElse(null);
    }

    // UPDATE result
    @PutMapping("/{id}")
    public Result update(@PathVariable String id, @RequestBody Result updated){

        Result existing = resultRepository.findById(id).orElse(null);

        if(existing == null) return null;

        existing.setTestName(updated.getTestName());
        existing.setMarks(updated.getMarks());

        return resultRepository.save(existing);
    }

}