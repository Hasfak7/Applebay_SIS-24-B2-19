package com.applebay.institute.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Course code is required")
    @Column(name = "course_code", nullable = false, unique = true, length = 50)
    private String courseCode;

    @NotBlank(message = "Course name is required")
    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @NotBlank(message = "Course level is required")
    @Column(name = "level", nullable = false, length = 50)
    private String level;

    @NotBlank(message = "Course duration is required")
    @Column(name = "duration", nullable = false, length = 50)
    private String duration;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Course() {
    }

    public Course(Long id, String courseCode, String name, String level, String duration) {
        this.id = id;
        this.courseCode = courseCode;
        this.name = name;
        this.level = level;
        this.duration = duration;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
