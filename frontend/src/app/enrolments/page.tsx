'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { enrolmentApi, studentApi, courseApi } from '@/services/api';
import { Enrolment, Student, Course } from '@/types';

function EnrolmentsContent() {
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter state
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');

  // Enrol modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
  const [enrolmentDate, setEnrolmentDate] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setEnrolmentDate(new Date().toISOString().split('T')[0]);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [enrolmentsData, studentsData, coursesData] = await Promise.all([
        enrolmentApi.getAll(),
        studentApi.getAll(),
        courseApi.getAll(),
      ]);
      setEnrolments(enrolmentsData);
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load enrolment records');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openEnrolModal = () => {
    setSelectedStudentId(students.length > 0 && students[0].id ? students[0].id : '');
    setSelectedCourseId(courses.length > 0 && courses[0].id ? courses[0].id : '');
    setEnrolmentDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEnrolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) {
      setError('Please select both a student and a course');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await enrolmentApi.enrol({
        studentId: Number(selectedStudentId),
        courseId: Number(selectedCourseId),
        enrolmentDate,
      });
      setSuccess('Student successfully enrolled in course!');
      closeModal();
      await loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to enrol student. The student might already be enrolled in this course.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEnrolment = async (enrolment: Enrolment) => {
    if (!enrolment.id) return;
    const confirmed = window.confirm(`Remove enrolment of "${enrolment.student.name}" from course "${enrolment.course.name}"?`);
    if (!confirmed) return;

    try {
      setError(null);
      setSuccess(null);
      await enrolmentApi.delete(enrolment.id);
      setSuccess('Enrolment removed successfully');
      await loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to remove enrolment');
      }
    }
  };

  const filteredEnrolments = selectedCourseFilter === 'ALL'
    ? enrolments
    : enrolments.filter((e) => e.course.id?.toString() === selectedCourseFilter);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Course Enrolments</h1>
          <p className="page-description">Enrol students into academic courses and manage enrolments</p>
        </div>
        <button className="btn btn-primary" onClick={openEnrolModal} disabled={students.length === 0 || courses.length === 0}>
          + Enrol a Student
        </button>
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

      {/* Filter by Course Bar */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Filter by Course:</label>
          <select
            className="form-select"
            style={{ width: '280px' }}
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
          >
            <option value="ALL">All Courses ({enrolments.length} enrolments)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id?.toString()}>
                {c.courseCode} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Showing {filteredEnrolments.length} enrolment records
        </div>
      </div>

      {/* Enrolments Table */}
      <div className="card">
        {loading ? (
          <div className="empty-state">Loading enrolments...</div>
        ) : filteredEnrolments.length === 0 ? (
          <div className="empty-state">
            <p>No enrolments found.</p>
            {students.length > 0 && courses.length > 0 && (
              <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={openEnrolModal}>
                Enrol First Student
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Enrolment ID</th>
                  <th>Student Name</th>
                  <th>NIC</th>
                  <th>Email</th>
                  <th>Enrolled Course</th>
                  <th>Enrolment Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrolments.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{item.student.name}</td>
                    <td>{item.student.nic}</td>
                    <td>{item.student.email}</td>
                    <td>
                      <div>
                        <span className="badge badge-course" style={{ marginRight: '6px' }}>
                          {item.course.courseCode}
                        </span>
                        <span>{item.course.name}</span>
                      </div>
                    </td>
                    <td>{item.enrolmentDate}</td>
                    <td>
                      <span className="badge badge-present">{item.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteEnrolment(item)}
                      >
                        Unenroll
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog for Enrolment */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Enrol Student in Course</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>

            <form onSubmit={handleEnrolSubmit}>
              <div className="form-group">
                <label className="form-label">Select Student *</label>
                <select
                  required
                  className="form-select"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                >
                  <option value="" disabled>-- Choose a student --</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} (NIC: {student.nic})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Course *</label>
                <select
                  required
                  className="form-select"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                >
                  <option value="" disabled>-- Choose a course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.courseCode} - {course.name} ({course.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Enrolment Date *</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={enrolmentDate}
                  onChange={(e) => setEnrolmentDate(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Enrolling...' : 'Confirm Enrolment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EnrolmentsPage() {
  return (
    <Suspense fallback={<div className="card"><div className="empty-state">Loading enrolments...</div></div>}>
      <EnrolmentsContent />
    </Suspense>
  );
}
