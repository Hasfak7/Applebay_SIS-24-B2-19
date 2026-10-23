-- ====================================================================
-- Applebay Institute Management System - PostgreSQL Schema
-- Database: applebay_institute (or applebay_db)
-- ====================================================================

-- 1. COURSES TABLE (FR01)
CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    course_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    level VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. STUDENTS TABLE (FR02 & FR03)
CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    nic VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ENROLMENTS TABLE (FR04)
CREATE TABLE IF NOT EXISTS enrolments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    CONSTRAINT uq_student_course UNIQUE (student_id, course_id)
);

-- 4. ATTENDANCE TABLE (FR05 & FR06)
CREATE TABLE IF NOT EXISTS attendance (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent')),
    remarks VARCHAR(255),
    CONSTRAINT uq_student_course_date UNIQUE (student_id, course_id, attendance_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_name ON students (name);
CREATE INDEX IF NOT EXISTS idx_enrolments_student ON enrolments (student_id);
CREATE INDEX IF NOT EXISTS idx_enrolments_course ON enrolments (course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance (student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course_date ON attendance (course_id, attendance_date);
