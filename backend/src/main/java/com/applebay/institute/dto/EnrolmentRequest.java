package com.applebay.institute.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class EnrolmentRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    private LocalDate enrolmentDate;

    public EnrolmentRequest() {
    }

    public EnrolmentRequest(Long studentId, Long courseId, LocalDate enrolmentDate) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.enrolmentDate = enrolmentDate;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public LocalDate getEnrolmentDate() {
        return enrolmentDate;
    }

    public void setEnrolmentDate(LocalDate enrolmentDate) {
        this.enrolmentDate = enrolmentDate;
    }
}
