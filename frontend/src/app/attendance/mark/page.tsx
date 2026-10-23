'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { courseApi, enrolmentApi, attendanceApi } from '@/services/api';
import { Course, Enrolment, StudentAttendanceItem } from '@/types';

interface AttendanceRowItem {
  studentId: number;
  studentName: string;
  studentNic: string;
  status: 'Present' | 'Absent';
  remarks: string;
}

function MarkAttendanceContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
  const [attendanceDate, setAttendanceDate] = useState<string>('');

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const [attendanceRows, setAttendanceRows] = useState<AttendanceRowItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize date on client mount
  useEffect(() => {
    setAttendanceDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Load all available courses
  useEffect(() => {
    async function initCourses() {
      try {
        setLoadingCourses(true);
        const data = await courseApi.getAll();
        setCourses(data);
        if (data.length > 0 && data[0].id) {
          setSelectedCourseId(data[0].id);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load courses');
        }
      } finally {
        setLoadingCourses(false);
      }
    }
    initCourses();
  }, []);

  // Fetch enrolled students and existing attendance when course or date changes
  const loadCourseStudentsAndAttendance = useCallback(async () => {
    if (!selectedCourseId || !attendanceDate) return;

    try {
      setLoadingStudents(true);
      setError(null);
      setSuccess(null);

      const [enrolments, existingAttendance] = await Promise.all([
        enrolmentApi.getByCourse(Number(selectedCourseId)),
        attendanceApi.getByCourse(Number(selectedCourseId), attendanceDate),
      ]);

      const attendanceMap = new Map<number, { status: 'Present' | 'Absent'; remarks: string }>();
      existingAttendance.forEach((rec) => {
        attendanceMap.set(rec.studentId, {
          status: rec.status,
          remarks: rec.remarks || '',
        });
      });

      const rows: AttendanceRowItem[] = enrolments.map((enrol: Enrolment) => {
        const student = enrol.student;
        const existing = attendanceMap.get(student.id!);
        return {
          studentId: student.id!,
          studentName: student.name,
          studentNic: student.nic,
          status: existing ? existing.status : 'Present',
          remarks: existing ? existing.remarks : '',
        };
      });

      setAttendanceRows(rows);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load enrolled students or attendance records');
      }
    } finally {
      setLoadingStudents(false);
    }
  }, [selectedCourseId, attendanceDate]);

  useEffect(() => {
    if (selectedCourseId && attendanceDate) {
      loadCourseStudentsAndAttendance();
    }
  }, [selectedCourseId, attendanceDate, loadCourseStudentsAndAttendance]);

  const handleStatusChange = (studentId: number, status: 'Present' | 'Absent') => {
    setAttendanceRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setAttendanceRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, remarks } : r))
    );
  };

  const handleMarkAll = (status: 'Present' | 'Absent') => {
    setAttendanceRows((prev) => prev.map((r) => ({ ...r, status })));
  };

  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    if (attendanceRows.length === 0) {
      setError('No students enrolled in this course to mark attendance.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const items: StudentAttendanceItem[] = attendanceRows.map((r) => ({
      studentId: r.studentId,
      status: r.status,
      remarks: r.remarks,
    }));

    try {
      await attendanceApi.markAttendance({
        courseId: Number(selectedCourseId),
        attendanceDate,
        items,
      });
      setSuccess(`Attendance for ${attendanceRows.length} student(s) successfully recorded on ${attendanceDate}!`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save attendance records');
      }
    } finally {
      setSaving(false);
    }
  };

  const presentCount = attendanceRows.filter((r) => r.status === 'Present').length;
  const absentCount = attendanceRows.filter((r) => r.status === 'Absent').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mark Attendance</h1>
          <p className="page-description">
            Mark attendance (Present / Absent) for students of a course on a selected date
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button className="btn btn-sm btn-secondary" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
          <button className="btn btn-sm btn-secondary" onClick={() => setSuccess(null)}>Dismiss</button>
        </div>
      )}

      {/* Course & Date Filter Controls */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Course *</label>
            <select
              className="form-select"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
              disabled={loadingCourses}
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseCode} - {course.name} ({course.level})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Attendance Date *</label>
            <input
              type="date"
              className="form-input"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Attendance Form */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Student Attendance Sheet</h2>
            <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Enrolled: <strong>{attendanceRows.length}</strong></span>
              <span style={{ color: '#34d399' }}>Present: <strong>{presentCount}</strong></span>
              <span style={{ color: '#f87171' }}>Absent: <strong>{absentCount}</strong></span>
            </div>
          </div>

          {attendanceRows.length > 0 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => handleMarkAll('Present')}
              >
                Mark All Present
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => handleMarkAll('Absent')}
              >
                Mark All Absent
              </button>
            </div>
          )}
        </div>

        {loadingStudents ? (
          <div className="empty-state">Loading enrolled students for this course...</div>
        ) : attendanceRows.length === 0 ? (
          <div className="empty-state">
            <p>No students enrolled in this course yet.</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>
              Go to the Course Enrolments page to enrol students in this course first.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSaveAttendance}>
            <div className="table-container" style={{ marginBottom: '24px' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>NIC</th>
                    <th style={{ width: '220px' }}>Attendance Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRows.map((row) => (
                    <tr key={row.studentId}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{row.studentName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{row.studentId}</div>
                      </td>
                      <td>
                        <span className="badge badge-course">{row.studentNic}</span>
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              row.status === 'Present' ? 'btn-success' : 'btn-secondary'
                            }`}
                            onClick={() => handleStatusChange(row.studentId, 'Present')}
                            style={{
                              boxShadow: row.status === 'Present' ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                            }}
                          >
                            ✓ Present
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              row.status === 'Absent' ? 'btn-danger' : 'btn-secondary'
                            }`}
                            onClick={() => handleStatusChange(row.studentId, 'Absent')}
                            style={{
                              backgroundColor: row.status === 'Absent' ? '#ef4444' : undefined,
                              color: row.status === 'Absent' ? '#fff' : undefined,
                              boxShadow: row.status === 'Absent' ? '0 0 10px rgba(239, 68, 68, 0.4)' : 'none',
                            }}
                          >
                            ✗ Absent
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                          placeholder="Optional remarks (e.g. On time, Medical)"
                          value={row.remarks}
                          onChange={(e) => handleRemarksChange(row.studentId, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || attendanceRows.length === 0}
                style={{ minWidth: '180px' }}
              >
                {saving ? 'Saving Records...' : 'Save Attendance'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function MarkAttendancePage() {
  return (
    <Suspense fallback={<div className="card"><div className="empty-state">Loading attendance sheet...</div></div>}>
      <MarkAttendanceContent />
    </Suspense>
  );
}
