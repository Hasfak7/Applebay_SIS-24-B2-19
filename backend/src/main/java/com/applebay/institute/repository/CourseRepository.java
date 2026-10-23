package com.applebay.institute.repository;

import com.applebay.institute.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCode(String courseCode);
    boolean existsByCourseCode(String courseCode);
    boolean existsByCourseCodeAndIdNot(String courseCode, Long id);
}
