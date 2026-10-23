package com.applebay.institute.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Student name is required")
    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @NotBlank(message = "NIC is required")
    @Column(name = "nic", nullable = false, unique = true, length = 30)
    private String nic;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Column(name = "phone", nullable = false, length = 30)
    private String phone;

    @NotBlank(message = "Address is required")
    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Student() {
    }

    public Student(Long id, String name, String nic, String email, String phone, String address) {
        this.id = id;
        this.name = name;
        this.nic = nic;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
