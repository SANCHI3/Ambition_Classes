package com.ambition.ambitionbackend.model;

public class StudentRequest {

    private String studentMobile;
    private String parentMobile;
    private String name;
    private String className;
    private double totalFees;
    private double paidAmount;

    public String getClassName() {
        return className;
    }

    public double getTotalFees() { return totalFees; }
    public double getPaidAmount() { return paidAmount; }
    public String getName() {
        return name;
    }
    // getters
    public String getStudentMobile() {
        return studentMobile;
    }

    public String getParentMobile() {
        return parentMobile;
    }

    // setters
    public void setStudentMobile(String studentMobile) {
        this.studentMobile = studentMobile;
    }

    public void setParentMobile(String parentMobile) {
        this.parentMobile = parentMobile;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public void setTotalFees(double totalFees) { this.totalFees = totalFees; }
    public void setPaidAmount(double paidAmount) { this.paidAmount = paidAmount; }
}