package com.ambition.ambitionbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "attendance")
public class Attendance {

    @Id
    private String id;

    private String studentMobile;   // ✅ ONLY identifier
    private String name;
    private String className;
    private String date;
    private String status;

    // getters
    public String getId() { return id; }
    public String getStudentMobile() { return studentMobile; }
    public String getName() { return name; }
    public String getClassName() { return className; }
    public String getDate() { return date; }
    public String getStatus() { return status; }

    // setters
    public void setId(String id) { this.id = id; }
    public void setStudentMobile(String studentMobile) { this.studentMobile = studentMobile; }
    public void setName(String name) { this.name = name; }
    public void setClassName(String className) { this.className = className; }
    public void setDate(String date) { this.date = date; }
    public void setStatus(String status) { this.status = status; }
}