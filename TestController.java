package com.ambition.ambitionbackend.controller;

import com.ambition.ambitionbackend.model.Test;
import com.ambition.ambitionbackend.model.Question;
import com.ambition.ambitionbackend.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/tests")
public class TestController {

    @Autowired
    private TestRepository repository;

    // ✅ CREATE TEST
    @PostMapping
    public Test createTest(@RequestBody Test test) {
        return repository.save(test);
    }

    // ✅ GET ALL TESTS
    @GetMapping
    public List<Test> getTests() {
        return repository.findAll();
    }

    // ✅ ADD QUESTION TO TEST
    @PostMapping("/{id}/questions")
    public Test addQuestion(@PathVariable String id, @RequestBody Question question) {

        Test test = repository.findById(id).orElse(null);

        if (test == null) return null;

        if (test.getQuestions() == null) {
            test.setQuestions(new ArrayList<>());
        }

        test.getQuestions().add(question);

        return repository.save(test);
    }

    // ✅ DELETE TEST
    @DeleteMapping("/{id}")
    public void deleteTest(@PathVariable String id) {
        repository.deleteById(id);
    }
}