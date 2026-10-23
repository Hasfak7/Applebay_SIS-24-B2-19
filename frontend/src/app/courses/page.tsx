'use client';

import { useEffect, useState } from 'react';
import { courseApi } from '@/services/api';
import { Course } from '@/types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Course>({
    courseCode: '',
    name: '',
    level: 'Diploma',
    duration: '6 Months',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseApi.getAll();
      setCourses(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load courses');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({
      courseCode: '',
      name: '',
      level: 'Diploma',
      duration: '6 Months',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      courseCode: course.courseCode,
      name: course.name,
      level: course.level,
      duration: course.duration,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingCourse && editingCourse.id) {
        await courseApi.update(editingCourse.id, formData);
        setSuccess(`Course "${formData.courseCode}" updated successfully!`);
      } else {
        await courseApi.create(formData);
        setSuccess(`Course "${formData.courseCode}" registered successfully!`);
      }
      closeModal();
      await loadCourses();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save course. Please check all input fields.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!course.id) return;
    const confirmed = window.confirm(`Are you sure you want to delete course ${course.courseCode} - ${course.name}?`);
    if (!confirmed) return;

    try {
      setError(null);
      setSuccess(null);
      await courseApi.delete(course.id);
      setSuccess(`Course ${course.courseCode} deleted successfully!`);
      await loadCourses();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete course');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Courses Management</h1>
          <p className="page-description">Add, view, update, and manage academic courses</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add New Course
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

      {/* Course List Card */}
      <div className="card">
        {loading ? (
          <div className="empty-state">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <p>No courses found in database.</p>
            <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={openAddModal}>
              Create First Course
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Academic Level</th>
                  <th>Duration</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <span className="badge badge-course">{course.courseCode}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{course.name}</td>
                    <td>
                      <span className="badge badge-level">{course.level}</span>
                    </td>
                    <td>{course.duration}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => openEditModal(course)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(course)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog for Add / Edit */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingCourse ? 'Update Course' : 'Add New Course'}
              </h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Course Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS101, WD202"
                  className="form-input"
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diploma in Software Engineering"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Level *</label>
                  <select
                    className="form-select"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  >
                    <option value="Certificate">Certificate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Higher Diploma">Higher Diploma</option>
                    <option value="Degree">Degree</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Advanced">Advanced Bootcamp</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Months, 1 Year"
                    className="form-input"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
