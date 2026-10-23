package com.applebay.institute.service;

import com.applebay.institute.entity.Student;
import com.applebay.institute.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public List<Student> searchStudentsByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return studentRepository.findAll();
        }
        return studentRepository.findByNameContainingIgnoreCase(name.trim());
    }

    public Student createStudent(Student student) {
        if (studentRepository.existsByNic(student.getNic())) {
            throw new RuntimeException("Student with NIC '" + student.getNic() + "' already exists");
        }
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Student with Email '" + student.getEmail() + "' already exists");
        }
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student updated) {
        Student existing = getStudentById(id);

        if (studentRepository.existsByNicAndIdNot(updated.getNic(), id)) {
            throw new RuntimeException("NIC '" + updated.getNic() + "' is already registered to another student");
        }
        if (studentRepository.existsByEmailAndIdNot(updated.getEmail(), id)) {
            throw new RuntimeException("Email '" + updated.getEmail() + "' is already registered to another student");
        }

        existing.setName(updated.getName());
        existing.setNic(updated.getNic());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        return studentRepository.save(existing);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }
}
