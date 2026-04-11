package com.ambition.ambitionbackend.controller;

import com.ambition.ambitionbackend.model.ResultImage;
import com.ambition.ambitionbackend.repository.ResultImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/api/result-images")
@CrossOrigin
public class ResultImageController {

    @Autowired
    private ResultImageRepository repo;

    // ✅ UPLOAD IMAGE (NO resultId)
    @PostMapping("/upload")
    public ResultImage upload(@RequestParam("file") MultipartFile file) throws IOException {

        Files.createDirectories(Paths.get("uploads"));

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get("uploads/" + fileName);

        Files.write(path, file.getBytes());

        ResultImage r = new ResultImage();
        r.setImage("uploads/" + fileName); // ✅ MUST HAVE /

        return repo.save(r);
    }

    // ✅ GET ALL IMAGES
    @GetMapping
    public List<ResultImage> getAll() {
        return repo.findAll();
    }

    // ✅ DELETE IMAGE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repo.deleteById(id);
    }
}