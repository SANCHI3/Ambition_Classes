package com.ambition.ambitionbackend.controller;

import com.ambition.ambitionbackend.model.Event;
import com.ambition.ambitionbackend.repository.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // ✅ 1. Create Event
    @PostMapping("/api/events")
    public Event createEvent(@RequestBody Event event){
        return eventRepository.save(event);
    }

    // ✅ 2. Upload Photo
    @PostMapping("/api/upload")
    public String upload(@RequestParam("file") MultipartFile file,
                         @RequestParam("eventId") String eventId) {

        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            if (eventId == null || eventId.isEmpty()) {
                throw new RuntimeException("Event ID missing");
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            String uploadDir = "C:/Users/SANCHI/IdeaProjects/ambition-backend/uploads/";

            File folder = new File(uploadDir);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            File dest = new File(uploadDir + fileName);
            file.transferTo(dest);

            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            if (event.getPhotos() == null) {
                event.setPhotos(new ArrayList<>());
            }

            event.getPhotos().add("uploads/" + fileName);

            eventRepository.save(event);

            return "uploads/" + fileName;

        } catch (Exception e) {
            e.printStackTrace();   // 🔥 THIS IS IMPORTANT
            return "ERROR: " + e.getMessage();
        }
    }

    // ✅ 3. Get Events
    @GetMapping("/api/events")
    public List<Event> getEvents(){
        return eventRepository.findAll();
    }
    @DeleteMapping("/api/photo")
    public String deletePhoto(@RequestParam String eventId,
                              @RequestParam String photoPath){

        Event event = eventRepository.findById(eventId).orElseThrow();

        if(event.getPhotos() != null){
            event.getPhotos().remove(photoPath);
        }

        // delete file from folder
        File file = new File("C:/Users/SANCHI/IdeaProjects/ambition-backend/" + photoPath);
        if(file.exists()){
            file.delete();
        }

        eventRepository.save(event);

        return "Photo deleted";
    }
    @DeleteMapping("/api/event/{id}")
    public String deleteEvent(@PathVariable String id){

        Event event = eventRepository.findById(id).orElseThrow();

        // delete all photos from folder
        if(event.getPhotos() != null){
            for(String path : event.getPhotos()){
                File file = new File(System.getProperty("user.dir") + "/" + path);
                if(file.exists()){
                    file.delete();
                }
            }
        }

        eventRepository.deleteById(id);

        return "Event deleted";
    }
}