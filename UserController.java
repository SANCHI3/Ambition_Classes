package com.ambition.ambitionbackend.controller;

import com.ambition.ambitionbackend.model.*;
import com.ambition.ambitionbackend.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/create-student")
    public ResponseEntity<?> createStudent(@RequestBody StudentRequest req){

        // 🔴 VALIDATION
        if(req.getStudentMobile() == null || req.getStudentMobile().isEmpty()
                || req.getParentMobile() == null || req.getParentMobile().isEmpty()){
            return ResponseEntity.badRequest().body("Mobile numbers missing");
        }

        String studentMobile = req.getStudentMobile();
        String parentMobile = req.getParentMobile();

        System.out.println("REQ: " + studentMobile + " " + parentMobile);

        // ✅ 1. SAVE STUDENT
        Student student = new Student();
        student.setStudentMobile(studentMobile);
        student.setParentMobile(parentMobile);

        // optional default values
        student.setName(req.getName());
        student.setStudentMobile(req.getStudentMobile());
        student.setParentMobile(req.getParentMobile());
        student.setClassName(req.getClassName());
        student.setTotalFees(req.getTotalFees());
        student.setPaidAmount(req.getPaidAmount());

        studentRepository.save(student);

        // ✅ CREATE STUDENT USER ACCOUNT
        User studentUser = userRepository.findByUsername(studentMobile);

        if(studentUser == null){
            studentUser = new User();
            studentUser.setUsername(studentMobile);
            studentUser.setPassword("default123");
            studentUser.setRole("student");
            studentUser.setFirstLogin(true);

            userRepository.save(studentUser);
        }
        // ✅ 2. HANDLE PARENT
        User parent = userRepository.findByUsername(parentMobile);

        if(parent == null){
            parent = new User();
            parent.setUsername(parentMobile);
            parent.setPassword("default123");
            parent.setRole("parent");
            parent.setChildren(new ArrayList<>());
        }

        if(parent.getChildren() == null){
            parent.setChildren(new ArrayList<>());
        }

        parent.getChildren().add(studentMobile);

        userRepository.save(parent);

        return ResponseEntity.ok("Student + Parent created");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user){

        User existing = userRepository.findByUsername(user.getUsername());

        if(existing == null || !existing.getPassword().equals(user.getPassword())){
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        return ResponseEntity.ok(existing); // ✅ includes firstLogin
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> data){

        String username = data.get("username");
        String oldPassword = data.get("oldPassword");
        String newPassword = data.get("newPassword");

        User user = userRepository.findByUsername(username);

        if(user == null || !user.getPassword().equals(oldPassword)){
            return ResponseEntity.status(400).body("Wrong old password");
        }

        user.setPassword(newPassword);
        user.setFirstLogin(false); // 🔥 VERY IMPORTANT

        userRepository.save(user);

        return ResponseEntity.ok("Password updated");
    }
}