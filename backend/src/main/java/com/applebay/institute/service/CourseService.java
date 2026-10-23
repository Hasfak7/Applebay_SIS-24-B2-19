package com.applebay.institute.service;

import com.applebay.institute.entity.Course;
import com.applebay.institute.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    public Course createCourse(Course course) {
        if (courseRepository.existsByCourseCode(course.getCourseCode())) {
            throw new RuntimeException("Course with code '" + course.getCourseCode() + "' already exists");
        }
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course updatedCourse) {
        Course existing = getCourseById(id);

        if (courseRepository.existsByCourseCodeAndIdNot(updatedCourse.getCourseCode(), id)) {
            throw new RuntimeException("Course code '" + updatedCourse.getCourseCode() + "' is already in use by another course");
        }

        existing.setCourseCode(updatedCourse.getCourseCode());
        existing.setName(updatedCourse.getName());
        existing.setLevel(updatedCourse.getLevel());
        existing.setDuration(updatedCourse.getDuration());
        return courseRepository.save(existing);
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }
}
