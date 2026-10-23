import {
  Course,
  Student,
  Enrolment,
  EnrolmentRequest,
  AttendanceRecord,
  MarkAttendanceRequest,
  StudentAttendanceSummary
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) {
        errorMessage = errorJson.message;
      } else if (errorJson.errors) {
        errorMessage = Object.values(errorJson.errors).join(', ');
      }
    } catch {
      // Fallback to text status
    }
    throw new Error(errorMessage);
  }
  
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

export const courseApi = {
  getAll: async (): Promise<Course[]> => {
    const res = await fetch(`${API_BASE_URL}/courses`, { cache: 'no-store' });
    return handleResponse<Course[]>(res);
  },
  getById: async (id: number): Promise<Course> => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, { cache: 'no-store' });
    return handleResponse<Course>(res);
  },
  create: async (course: Course): Promise<Course> => {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    return handleResponse<Course>(res);
  },
  update: async (id: number, course: Course): Promise<Course> => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    return handleResponse<Course>(res);
  },
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  },
};

export const studentApi = {
  getAll: async (searchQuery?: string): Promise<Student[]> => {
    const url = searchQuery && searchQuery.trim() !== ''
      ? `${API_BASE_URL}/students?search=${encodeURIComponent(searchQuery.trim())}`
      : `${API_BASE_URL}/students`;
    const res = await fetch(url, { cache: 'no-store' });
    return handleResponse<Student[]>(res);
  },
  getById: async (id: number): Promise<Student> => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, { cache: 'no-store' });
    return handleResponse<Student>(res);
  },
  create: async (student: Student): Promise<Student> => {
    const res = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    return handleResponse<Student>(res);
  },
  update: async (id: number, student: Student): Promise<Student> => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    return handleResponse<Student>(res);
  },
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  },
};

export const enrolmentApi = {
  getAll: async (): Promise<Enrolment[]> => {
    const res = await fetch(`${API_BASE_URL}/enrolments`, { cache: 'no-store' });
    return handleResponse<Enrolment[]>(res);
  },
  getByCourse: async (courseId: number): Promise<Enrolment[]> => {
    const res = await fetch(`${API_BASE_URL}/enrolments/course/${courseId}`, { cache: 'no-store' });
    return handleResponse<Enrolment[]>(res);
  },
  getByStudent: async (studentId: number): Promise<Enrolment[]> => {
    const res = await fetch(`${API_BASE_URL}/enrolments/student/${studentId}`, { cache: 'no-store' });
    return handleResponse<Enrolment[]>(res);
  },
  enrol: async (request: EnrolmentRequest): Promise<Enrolment> => {
    const res = await fetch(`${API_BASE_URL}/enrolments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<Enrolment>(res);
  },
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/enrolments/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  },
};

export const attendanceApi = {
  markAttendance: async (request: MarkAttendanceRequest): Promise<AttendanceRecord[]> => {
    const res = await fetch(`${API_BASE_URL}/attendance/mark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<AttendanceRecord[]>(res);
  },
  getByCourse: async (courseId: number, date: string): Promise<AttendanceRecord[]> => {
    const res = await fetch(`${API_BASE_URL}/attendance/course/${courseId}?date=${date}`, { cache: 'no-store' });
    return handleResponse<AttendanceRecord[]>(res);
  },
  getByStudent: async (studentId: number): Promise<AttendanceRecord[]> => {
    const res = await fetch(`${API_BASE_URL}/attendance/student/${studentId}`, { cache: 'no-store' });
    return handleResponse<AttendanceRecord[]>(res);
  },
  getStudentSummary: async (studentId: number): Promise<StudentAttendanceSummary> => {
    const res = await fetch(`${API_BASE_URL}/attendance/student/${studentId}/summary`, { cache: 'no-store' });
    return handleResponse<StudentAttendanceSummary>(res);
  },
  getAllSummaries: async (): Promise<StudentAttendanceSummary[]> => {
    const res = await fetch(`${API_BASE_URL}/attendance/summary/all`, { cache: 'no-store' });
    return handleResponse<StudentAttendanceSummary[]>(res);
  },
  getAllRecords: async (): Promise<AttendanceRecord[]> => {
    const res = await fetch(`${API_BASE_URL}/attendance/all`, { cache: 'no-store' });
    return handleResponse<AttendanceRecord[]>(res);
  },
};
