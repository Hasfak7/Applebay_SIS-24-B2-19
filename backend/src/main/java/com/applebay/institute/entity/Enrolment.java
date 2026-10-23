package com.applebay.institute.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "enrolments", uniqueConstraints = {
    @UniqueConstraint(name = "uq_student_course", columnNames = {"student_id", "course_id"})
})
public class Enrolment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "enrolment_date", nullable = false)
    private LocalDate enrolmentDate = LocalDate.now();

    @Column(name = "status", length = 20)
    private String status = "ACTIVE";

    public Enrolment() {
    }

    public Enrolment(Long id, Student student, Course course, LocalDate enrolmentDate, String status) {
        this.id = id;
        this.student = student;
        this.course = course;
        this.enrolmentDate = enrolmentDate != null ? enrolmentDate : LocalDate.now();
        this.status = status != null ? status : "ACTIVE";
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

    public LocalDate getEnrolmentDate() {
        return enrolmentDate;
    }

    public void setEnrolmentDate(LocalDate enrolmentDate) {
        this.enrolmentDate = enrolmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
