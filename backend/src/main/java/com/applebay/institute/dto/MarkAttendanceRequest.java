package com.applebay.institute.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class MarkAttendanceRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;

    @NotEmpty(message = "Attendance items cannot be empty")
    private List<StudentAttendanceItem> items;

    public MarkAttendanceRequest() {
    }

    public MarkAttendanceRequest(Long courseId, LocalDate attendanceDate, List<StudentAttendanceItem> items) {
        this.courseId = courseId;
        this.attendanceDate = attendanceDate;
        this.items = items;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public List<StudentAttendanceItem> getItems() {
        return items;
    }

    public void setItems(List<StudentAttendanceItem> items) {
        this.items = items;
    }
}
