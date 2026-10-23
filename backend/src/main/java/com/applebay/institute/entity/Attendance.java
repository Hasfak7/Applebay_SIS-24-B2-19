package com.applebay.institute.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "attendance", uniqueConstraints = {
    @UniqueConstraint(name = "uq_student_course_date", columnNames = {"student_id", "course_id", "attendance_date"})
})
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @NotBlank(message = "Status is required (Present/Absent)")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "remarks", length = 255)
    private String remarks;

    public Attendance() {
    }

    public Attendance(Long id, Student student, Course course, LocalDate attendanceDate, String status, String remarks) {
        this.id = id;
        this.student = student;
        this.course = course;
        this.attendanceDate = attendanceDate;
        this.status = status;
        this.remarks = remarks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
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
