package com.applebay.institute.controller;

import com.applebay.institute.dto.EnrolmentRequest;
import com.applebay.institute.entity.Enrolment;
import com.applebay.institute.service.EnrolmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrolments")
public class EnrolmentController {

    private final EnrolmentService enrolmentService;

    public EnrolmentController(EnrolmentService enrolmentService) {
        this.enrolmentService = enrolmentService;
    }

    @GetMapping
    public ResponseEntity<List<Enrolment>> getAllEnrolments() {
        return ResponseEntity.ok(enrolmentService.getAllEnrolments());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrolment>> getEnrolmentsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrolmentService.getEnrolmentsByCourse(courseId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Enrolment>> getEnrolmentsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(enrolmentService.getEnrolmentsByStudent(studentId));
    }

    @PostMapping
    public ResponseEntity<Enrolment> enrolStudent(@Valid @RequestBody EnrolmentRequest request) {
        Enrolment enrolment = enrolmentService.enrolStudent(
                request.getStudentId(),
                request.getCourseId(),
                request.getEnrolmentDate()
        );
        return new ResponseEntity<>(enrolment, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrolment(@PathVariable Long id) {
        enrolmentService.deleteEnrolment(id);
        return ResponseEntity.noContent().build();
    }
}
