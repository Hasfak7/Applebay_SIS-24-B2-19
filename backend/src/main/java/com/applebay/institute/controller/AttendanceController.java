package com.applebay.institute.controller;

import com.applebay.institute.dto.AttendanceRecordDto;
import com.applebay.institute.dto.MarkAttendanceRequest;
import com.applebay.institute.dto.StudentAttendanceSummaryDto;
import com.applebay.institute.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/mark")
    public ResponseEntity<List<AttendanceRecordDto>> markAttendance(@Valid @RequestBody MarkAttendanceRequest request) {
        List<AttendanceRecordDto> savedRecords = attendanceService.markAttendance(request);
        return new ResponseEntity<>(savedRecords, HttpStatus.OK);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AttendanceRecordDto>> getAttendanceByCourse(
            @PathVariable Long courseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByCourseAndDate(courseId, date));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceRecordDto>> getAttendanceByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
    }

    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<StudentAttendanceSummaryDto> getStudentAttendanceSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceSummary(studentId));
    }

    @GetMapping("/summary/all")
    public ResponseEntity<List<StudentAttendanceSummaryDto>> getAllStudentsAttendanceSummary() {
        return ResponseEntity.ok(attendanceService.getAllStudentsAttendanceSummary());
    }

    @GetMapping("/all")
    public ResponseEntity<List<AttendanceRecordDto>> getAllAttendanceRecords() {
        return ResponseEntity.ok(attendanceService.getAllAttendanceRecords());
    }
}
