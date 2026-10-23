export interface Course {
  id?: number;
  courseCode: string;
  name: string;
  level: string;
  duration: string;
  createdAt?: string;
}

export interface Student {
  id?: number;
  name: string;
  nic: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: string;
}

export interface Enrolment {
  id?: number;
  student: Student;
  course: Course;
  enrolmentDate: string;
  status: string;
}

export interface EnrolmentRequest {
  studentId: number;
  courseId: number;
  enrolmentDate?: string;
}

export interface AttendanceRecord {
  id?: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseCode: string;
  courseName: string;
  attendanceDate: string;
  status: 'Present' | 'Absent';
  remarks?: string;
}

export interface StudentAttendanceItem {
  studentId: number;
  status: 'Present' | 'Absent';
  remarks?: string;
}

export interface MarkAttendanceRequest {
  courseId: number;
  attendanceDate: string;
  items: StudentAttendanceItem[];
}

export interface StudentAttendanceSummary {
  studentId: number;
  studentName: string;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  records: AttendanceRecord[];
}
