package com.applebay.institute.service;

import com.applebay.institute.dto.*;
import com.applebay.institute.entity.Attendance;
import com.applebay.institute.entity.Course;
import com.applebay.institute.entity.Student;
import com.applebay.institute.repository.AttendanceRepository;
import com.applebay.institute.repository.CourseRepository;
import com.applebay.institute.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             StudentRepository studentRepository,
                             CourseRepository courseRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public List<AttendanceRecordDto> markAttendance(MarkAttendanceRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + request.getCourseId()));

        LocalDate date = request.getAttendanceDate();
        List<AttendanceRecordDto> resultList = new ArrayList<>();

        for (StudentAttendanceItem item : request.getItems()) {
            Student student = studentRepository.findById(item.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + item.getStudentId()));

            String normalizedStatus = "Present".equalsIgnoreCase(item.getStatus()) ? "Present" : "Absent";

            Optional<Attendance> existingOpt = attendanceRepository
                    .findByStudentIdAndCourseIdAndAttendanceDate(student.getId(), course.getId(), date);

            Attendance attendance;
            if (existingOpt.isPresent()) {
                attendance = existingOpt.get();
                attendance.setStatus(normalizedStatus);
                attendance.setRemarks(item.getRemarks());
            } else {
                attendance = new Attendance();
                attendance.setCourse(course);
                attendance.setStudent(student);
                attendance.setAttendanceDate(date);
                attendance.setStatus(normalizedStatus);
                attendance.setRemarks(item.getRemarks());
            }

            Attendance saved = attendanceRepository.save(attendance);
            resultList.add(toDto(saved));
        }

        return resultList;
    }

    public List<AttendanceRecordDto> getAttendanceByCourseAndDate(Long courseId, LocalDate date) {
        return attendanceRepository.findByCourseIdAndAttendanceDate(courseId, date)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<AttendanceRecordDto> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public StudentAttendanceSummaryDto getStudentAttendanceSummary(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        List<Attendance> records = attendanceRepository.findByStudentId(studentId);
        long totalSessions = records.size();
        long presentCount = records.stream()
                .filter(r -> "Present".equalsIgnoreCase(r.getStatus()))
                .count();
        long absentCount = totalSessions - presentCount;

        double percentage = totalSessions > 0
                ? Math.round(((double) presentCount / totalSessions) * 10000.0) / 100.0
                : 0.0;

        List<AttendanceRecordDto> dtoList = records.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return new StudentAttendanceSummaryDto(
                student.getId(),
                student.getName(),
                totalSessions,
                presentCount,
                absentCount,
                percentage,
                dtoList
        );
    }

    public List<StudentAttendanceSummaryDto> getAllStudentsAttendanceSummary() {
        List<Student> students = studentRepository.findAll();
        return students.stream()
                .map(s -> getStudentAttendanceSummary(s.getId()))
                .collect(Collectors.toList());
    }

    public List<AttendanceRecordDto> getAllAttendanceRecords() {
        return attendanceRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private AttendanceRecordDto toDto(Attendance a) {
        return new AttendanceRecordDto(
                a.getId(),
                a.getStudent().getId(),
                a.getStudent().getName(),
                a.getCourse().getId(),
                a.getCourse().getCourseCode(),
                a.getCourse().getName(),
                a.getAttendanceDate(),
                a.getStatus(),
                a.getRemarks()
        );
    }
}
