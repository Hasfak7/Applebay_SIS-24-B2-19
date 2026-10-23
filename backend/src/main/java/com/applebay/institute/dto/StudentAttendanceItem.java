package com.applebay.institute.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class StudentAttendanceItem {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Status is required (Present/Absent)")
    private String status;

    private String remarks;

    public StudentAttendanceItem() {
    }

    public StudentAttendanceItem(Long studentId, String status, String remarks) {
        this.studentId = studentId;
        this.status = status;
        this.remarks = remarks;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
