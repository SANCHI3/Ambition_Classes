package com.ambition.ambitionbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import com.ambition.ambitionbackend.model.ContactRequest;
@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping
    public String sendEmail(@RequestBody ContactRequest request){

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("ambitionclasses@gmail.com"); // YOUR RECEIVING MAIL
        message.setSubject("New Contact Message");

        message.setText(
                "Name: " + request.getName() +
                        "\nPhone: " + request.getPhone() +
                        "\nEmail: " + request.getEmail() +
                        "\nMessage: " + request.getMessage()
        );

        mailSender.send(message);

        return "Email sent successfully";
    }
}