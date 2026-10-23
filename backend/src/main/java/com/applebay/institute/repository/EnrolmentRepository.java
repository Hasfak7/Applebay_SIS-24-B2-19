package com.applebay.institute.repository;

import com.applebay.institute.entity.Enrolment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrolmentRepository extends JpaRepository<Enrolment, Long> {
    List<Enrolment> findByCourseId(Long courseId);
    List<Enrolment> findByStudentId(Long studentId);
    Optional<Enrolment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}
