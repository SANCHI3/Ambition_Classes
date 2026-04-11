package com.ambition.ambitionbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
public class Student {

    @Id
    private String id;

    private String studentMobile;
    private String parentMobile;
    private String name;
    private String className;
    private String feesStatus;
    private double totalFees;
    private double paidAmount;

    public String getFeesStatus() {
        if (paidAmount >= totalFees) return "Paid";
        else if (paidAmount == 0) return "Pending";
        else return "Partial";
    }

    // GETTERS
    public String getId() { return id; }
    public String getStudentMobile() { return studentMobile; }
    public String getParentMobile() { return parentMobile; }
    public String getName() { return name; }
    public String getClassName() { return className; }

    // SETTERS
    public void setId(String id) { this.id = id; }
    public void setStudentMobile(String studentMobile) { this.studentMobile = studentMobile; }
    public void setParentMobile(String parentMobile) { this.parentMobile = parentMobile; }
    public void setName(String name) { this.name = name; }
    public void setClassName(String className) { this.className = className; }

    public double getTotalFees() {
        return totalFees;
    }

    public void setTotalFees(double totalFees) {
        this.totalFees = totalFees;
    }

    public double getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(double paidAmount) {
        this.paidAmount = paidAmount;
    }

}