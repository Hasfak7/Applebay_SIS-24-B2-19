package com.applebay.institute.repository;

import com.applebay.institute.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByCourseIdAndAttendanceDate(Long courseId, LocalDate attendanceDate);
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByStudentIdAndCourseId(Long studentId, Long courseId);
    Optional<Attendance> findByStudentIdAndCourseIdAndAttendanceDate(Long studentId, Long courseId, LocalDate attendanceDate);
    long countByStudentId(Long studentId);
    long countByStudentIdAndStatusIgnoreCase(Long studentId, String status);
}
