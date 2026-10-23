'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { studentApi } from '@/services/api';
import { Student } from '@/types';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Student>({
    name: '',
    nic: '',
    email: '',
    phone: '',
    address: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadStudents = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getAll(query);
      setStudents(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load students');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadStudents(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadStudents('');
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      nic: '',
      email: '',
      phone: '',
      address: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      nic: student.nic,
      email: student.email,
      phone: student.phone,
      address: student.address,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingStudent && editingStudent.id) {
        await studentApi.update(editingStudent.id, formData);
        setSuccess(`Student "${formData.name}" updated successfully!`);
      } else {
        await studentApi.create(formData);
        setSuccess(`Student "${formData.name}" registered successfully!`);
      }
      closeModal();
      await loadStudents(searchQuery);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save student profile. Please verify NIC and Email uniqueness.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (student: Student) => {
    if (!student.id) return;
    const confirmed = window.confirm(`Are you sure you want to delete student "${student.name}" (NIC: ${student.nic})? This will also remove associated enrolments and attendance records.`);
    if (!confirmed) return;

    try {
      setError(null);
      setSuccess(null);
      await studentApi.delete(student.id);
      setSuccess(`Student "${student.name}" deleted successfully!`);
      await loadStudents(searchQuery);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete student');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Directory</h1>
          <p className="page-description">Register, view, update, delete, and search students by name</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Register New Student
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

      {/* Search Header Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} className="search-box">
          <input
            type="text"
            className="form-input"
            placeholder="Search student by name (e.g. Kasun, Silva)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
          {searchQuery && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleClearSearch}>
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Student List Table */}
      <div className="card">
        {loading ? (
          <div className="empty-state">Searching student records...</div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <p>No students found matching your criteria.</p>
            {searchQuery ? (
              <button className="btn btn-sm btn-secondary" style={{ marginTop: '10px' }} onClick={handleClearSearch}>
                Reset Search Filter
              </button>
            ) : (
              <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={openAddModal}>
                Register First Student
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>NIC</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{student.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{student.id}</div>
                    </td>
                    <td>
                      <span className="badge badge-course">{student.nic}</span>
                    </td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {student.address}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Link
                          href={`/attendance/student?studentId=${student.id}`}
                          className="btn btn-sm btn-secondary"
                          title="View Attendance Records & %"
                        >
                          Attendance
                        </Link>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => openEditModal(student)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(student)}
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

      {/* Modal Dialog for Register / Edit Student */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingStudent ? 'Update Student Profile' : 'Register New Student'}
              </h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nipuni Fernando"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">NIC (National ID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 200156708912"
                    className="form-input"
                    value={formData.nic}
                    onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +94 77 123 4567"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@applebay.edu"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal Address *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. 45 Galle Road, Colombo 03"
                  className="form-textarea"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingStudent ? 'Update Student' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
