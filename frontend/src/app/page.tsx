'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { courseApi, studentApi, enrolmentApi } from '@/services/api';
import { Course, Student, Enrolment } from '@/types';

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);
        const [coursesData, studentsData, enrolmentsData] = await Promise.all([
          courseApi.getAll(),
          studentApi.getAll(),
          enrolmentApi.getAll(),
        ]);
        setCourses(coursesData);
        setStudents(studentsData);
        setEnrolments(enrolmentsData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unable to load institute data. Please check connection and try again.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Applebay Institute Dashboard</h1>
          <p className="page-description">Overview of courses, enrolled students, and academic attendance</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <div>
            <strong>Notice:</strong> {error}
          </div>
          <button className="btn btn-sm btn-secondary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="stat-grid">
        <div className="stat-card blue">
          <div>
            <div className="stat-label">Total Courses</div>
            <div className="stat-value">{loading ? '...' : courses.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Active academic programs</div>
          </div>
          <div className="stat-icon" style={{ color: '#60a5fa' }}>
            📚
          </div>
        </div>

        <div className="stat-card purple">
          <div>
            <div className="stat-label">Registered Students</div>
            <div className="stat-value">{loading ? '...' : students.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Verified student profiles</div>
          </div>
          <div className="stat-icon" style={{ color: '#c084fc' }}>
            🎓
          </div>
        </div>

        <div className="stat-card emerald">
          <div>
            <div className="stat-label">Total Enrolments</div>
            <div className="stat-value">{loading ? '...' : enrolments.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Course admissions</div>
          </div>
          <div className="stat-icon" style={{ color: '#34d399' }}>
            📝
          </div>
        </div>

        <div className="stat-card amber">
          <div>
            <div className="stat-label">Attendance System</div>
            <div className="stat-value" style={{ fontSize: '24px', paddingTop: '6px' }}>Ready</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Daily session tracking</div>
          </div>
          <div className="stat-icon" style={{ color: '#fbbf24' }}>
            📅
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#fff' }}>Quick Operations</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '36px' }}>
        <Link href="/courses" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Course Management</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Add, view, edit, and delete academic courses with level and duration.
          </p>
          <span style={{ fontSize: '13px', color: 'var(--brand-secondary)', fontWeight: 600, marginTop: '8px' }}>Manage Courses &rarr;</span>
        </Link>

        <Link href="/students" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Student Directory</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Register new students, update contact details, and search by name.
          </p>
          <span style={{ fontSize: '13px', color: 'var(--brand-secondary)', fontWeight: 600, marginTop: '8px' }}>Search &amp; Register &rarr;</span>
        </Link>

        <Link href="/enrolments" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Enrol Students</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Enrol registered students into courses with admission date and status.
          </p>
          <span style={{ fontSize: '13px', color: 'var(--brand-secondary)', fontWeight: 600, marginTop: '8px' }}>Open Enrolments &rarr;</span>
        </Link>

        <Link href="/attendance/mark" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Mark Daily Attendance</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Record Present / Absent marks for students of a course on any date.
          </p>
          <span style={{ fontSize: '13px', color: 'var(--brand-secondary)', fontWeight: 600, marginTop: '8px' }}>Mark Attendance &rarr;</span>
        </Link>

        <Link href="/attendance/student" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Attendance Records &amp; Analytics</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Inspect complete attendance history and percentage calculation for any student.
          </p>
          <span style={{ fontSize: '13px', color: 'var(--brand-secondary)', fontWeight: 600, marginTop: '8px' }}>View Student Summary &rarr;</span>
        </Link>
      </div>

      {/* Recent Enrolments Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Recent Enrolments</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Latest students admitted to Applebay Institute courses</p>
          </div>
          <Link href="/enrolments" className="btn btn-sm btn-secondary">View All Enrolments</Link>
        </div>

        {loading ? (
          <div className="empty-state">Loading active records...</div>
        ) : enrolments.length === 0 ? (
          <div className="empty-state">No enrolments yet. Enrol students using the Enrolments menu.</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Enrolment ID</th>
                  <th>Student Name</th>
                  <th>NIC</th>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Enrolment Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enrolments.slice(0, 5).map((enrol) => (
                  <tr key={enrol.id}>
                    <td>#{enrol.id}</td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{enrol.student.name}</td>
                    <td>{enrol.student.nic}</td>
                    <td>
                      <span className="badge badge-course">{enrol.course.courseCode}</span>
                    </td>
                    <td>{enrol.course.name}</td>
                    <td>{enrol.enrolmentDate}</td>
                    <td>
                      <span className="badge badge-present">{enrol.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
