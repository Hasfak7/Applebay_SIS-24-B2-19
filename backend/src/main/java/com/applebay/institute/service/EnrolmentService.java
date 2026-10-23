package com.applebay.institute.service;

import com.applebay.institute.entity.Course;
import com.applebay.institute.entity.Enrolment;
import com.applebay.institute.entity.Student;
import com.applebay.institute.repository.CourseRepository;
import com.applebay.institute.repository.EnrolmentRepository;
import com.applebay.institute.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class EnrolmentService {

    private final EnrolmentRepository enrolmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public EnrolmentService(EnrolmentRepository enrolmentRepository,
                            StudentRepository studentRepository,
                            CourseRepository courseRepository) {
        this.enrolmentRepository = enrolmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public List<Enrolment> getAllEnrolments() {
        return enrolmentRepository.findAll();
    }

    public List<Enrolment> getEnrolmentsByCourse(Long courseId) {
        return enrolmentRepository.findByCourseId(courseId);
    }

    public List<Enrolment> getEnrolmentsByStudent(Long studentId) {
        return enrolmentRepository.findByStudentId(studentId);
    }

    public Enrolment enrolStudent(Long studentId, Long courseId, LocalDate enrolmentDate) {
        if (enrolmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        Enrolment enrolment = new Enrolment();
        enrolment.setStudent(student);
        enrolment.setCourse(course);
        enrolment.setEnrolmentDate(enrolmentDate != null ? enrolmentDate : LocalDate.now());
        enrolment.setStatus("ACTIVE");

        return enrolmentRepository.save(enrolment);
    }

    public void deleteEnrolment(Long id) {
        if (!enrolmentRepository.existsById(id)) {
            throw new RuntimeException("Enrolment not found with id: " + id);
        }
        enrolmentRepository.deleteById(id);
    }
}
