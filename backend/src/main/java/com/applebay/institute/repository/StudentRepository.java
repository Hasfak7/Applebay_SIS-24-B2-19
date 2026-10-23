package com.applebay.institute.repository;

import com.applebay.institute.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByNameContainingIgnoreCase(String name);
    Optional<Student> findByNic(String nic);
    Optional<Student> findByEmail(String email);
    boolean existsByNic(String nic);
    boolean existsByNicAndIdNot(String nic, Long id);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
}
