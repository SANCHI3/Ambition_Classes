package com.ambition.ambitionbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String username;   // 🔥 mobile number (LOGIN)
    private String password;
    private String role;       // admin / student / parent
    private String studentId;
    private String linkedUser; // 🔥 parent ↔ student mobile

    private List<String> children;
    private boolean firstLogin = true;

    public User() {}

    // GETTERS
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
    public String getLinkedUser() { return linkedUser; }
    public boolean isFirstLogin() { return firstLogin; }

    // SETTERS
    public void setId(String id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(String role) { this.role = role; }
    public void setLinkedUser(String linkedUser) { this.linkedUser = linkedUser; }
    public void setFirstLogin(boolean firstLogin) { this.firstLogin = firstLogin; }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public List<String> getChildren() {
        return children;
    }

    public void setChildren(List<String> children) {
        this.children = children;
    }
}