
package com.ambition.ambitionbackend.controller;

import com.ambition.ambitionbackend.model.Student;
import com.ambition.ambitionbackend.model.StudentRequest;
import com.ambition.ambitionbackend.model.User;
import com.ambition.ambitionbackend.repository.AttendanceRepository;
import com.ambition.ambitionbackend.repository.StudentRepository;
import com.ambition.ambitionbackend.model.Attendance;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ambition.ambitionbackend.repository.UserRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private UserRepository userRepository;

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // ✅ ADD
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    // ✅ GET
    @GetMapping("/all")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // ✅ DELETE
    @DeleteMapping("/{mobile}")
    public ResponseEntity<?> deleteStudent(@PathVariable String mobile){

        // 🔥 1. DELETE STUDENT
        Student student = studentRepository.findByStudentMobile(mobile);

        if(student != null){
            studentRepository.delete(student);
        }

        // 🔥 2. DELETE STUDENT USER
        User studentUser = userRepository.findByUsername(mobile);
        if(studentUser != null){
            userRepository.delete(studentUser);
        }

        // 🔥 3. REMOVE FROM PARENT
        List<User> parents = userRepository.findByRole("parent");

        for(User parent : parents){
            if(parent.getChildren() != null && parent.getChildren().contains(mobile)){

                parent.getChildren().remove(mobile);

                // 🔥 DELETE PARENT IF NO CHILDREN LEFT
                if(parent.getChildren().isEmpty()){
                    userRepository.delete(parent);
                } else {
                    userRepository.save(parent);
                }
            }
        }

        return ResponseEntity.ok("Deleted successfully");
    }
    // 🔥 ADD THIS HERE (UPDATE)
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable String id, @RequestBody Student student) {

        Student existing = studentRepository.findById(id).orElse(null);

        if (existing == null) return null;

        existing.setName(student.getName());
        existing.setStudentMobile(student.getStudentMobile());
        existing.setParentMobile(student.getParentMobile());
        existing.setClassName(student.getClassName());

        // 🔥 FEES LOGIC
        existing.setTotalFees(student.getTotalFees());
        existing.setPaidAmount(student.getPaidAmount());

        existing.setTotalFees(student.getTotalFees());
        existing.setPaidAmount(student.getPaidAmount());

        return studentRepository.save(existing);
    }
    @PutMapping("/fees/{mobile}")
    public Student updateFees(@PathVariable String mobile,
                              @RequestBody StudentRequest request) {

        System.out.println("Incoming → " + request.getTotalFees() + " / " + request.getPaidAmount());

        Student existing = studentRepository.findByStudentMobile(mobile);

        if (existing == null) {
            throw new RuntimeException("Student not found");
        }

        existing.setTotalFees(request.getTotalFees());
        existing.setPaidAmount(request.getPaidAmount());

        return studentRepository.save(existing);
    }
    @GetMapping("/id/{id}")
    public Student getById(@PathVariable String id){
        return studentRepository.findById(id).orElse(null);
    }

    @GetMapping("/mobile/{mobile}")
    public Student getByMobile(@PathVariable String mobile){
        return studentRepository.findByStudentMobile(mobile);
    }

    @RequestMapping(method = RequestMethod.OPTIONS, path = "/**")
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }


}