-- Sample Data Seed for Applebay Institute
INSERT INTO courses (course_code, name, level, duration) VALUES
('CS101', 'Certificate in Information Technology', 'Certificate', '3 Months'),
('CS201', 'Diploma in Software Engineering', 'Diploma', '6 Months'),
('CS301', 'BSc (Hons) in Computing & Systems', 'Degree', '3 Years'),
('WD102', 'Full-Stack Web Development Bootcamp', 'Advanced', '4 Months')
ON CONFLICT (course_code) DO NOTHING;

INSERT INTO students (name, nic, email, phone, address) VALUES
('Kasun Perera', '199823401234', 'kasun.perera@applebay.edu', '+94 77 123 4567', '45 Galle Road, Colombo 03'),
('Nipuni Fernando', '200156708912', 'nipuni.f@applebay.edu', '+94 71 987 6543', '12 Kandy Road, Kiribathgoda'),
('David Silva', '199978103456', 'david.silva@applebay.edu', '+94 76 345 6789', '88 Peradeniya Road, Kandy'),
('Amara Jayasinghe', '200234509876', 'amara.j@applebay.edu', '+94 70 567 8901', '23 Station Road, Negombo')
ON CONFLICT (nic) DO NOTHING;

-- Enrolments:
-- Kasun enrolled in CS101 and CS201
INSERT INTO enrolments (student_id, course_id, enrolment_date, status) VALUES
(1, 1, '2026-09-01', 'ACTIVE'),
(1, 2, '2026-10-01', 'ACTIVE'),
(2, 2, '2026-10-01', 'ACTIVE'),
(3, 3, '2026-09-15', 'ACTIVE'),
(4, 4, '2026-10-05', 'ACTIVE')
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Attendance records:
INSERT INTO attendance (student_id, course_id, attendance_date, status, remarks) VALUES
(1, 1, '2026-10-10', 'Present', 'On time'),
(1, 1, '2026-10-12', 'Present', 'Active in lab'),
(1, 1, '2026-10-15', 'Absent', 'Medical leave'),
(1, 1, '2026-10-18', 'Present', 'On time'),
(2, 2, '2026-10-10', 'Present', 'On time'),
(2, 2, '2026-10-12', 'Absent', 'Personal reason'),
(2, 2, '2026-10-15', 'Present', 'On time')
ON CONFLICT (student_id, course_id, attendance_date) DO NOTHING;
