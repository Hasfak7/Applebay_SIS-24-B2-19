'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { studentApi, attendanceApi } from '@/services/api';
import { Student, StudentAttendanceSummary } from '@/types';
import {
  exportStudentAttendanceToExcel,
  exportAllStudentsAttendanceToExcel,
  exportAttendanceToCsv,
} from '@/utils/exportExcel';

function StudentAttendanceContent() {
  const searchParams = useSearchParams();
  const queryStudentId = searchParams.get('studentId');

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [summary, setSummary] = useState<StudentAttendanceSummary | null>(null);

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load students for selector
  useEffect(() => {
    async function initStudents() {
      try {
        setLoadingStudents(true);
        const data = await studentApi.getAll();
        setStudents(data);

        if (queryStudentId) {
          const numericId = Number(queryStudentId);
          setSelectedStudentId(numericId);
        } else if (data.length > 0 && data[0].id) {
          setSelectedStudentId(data[0].id);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load students');
        }
      } finally {
        setLoadingStudents(false);
      }
    }
    initStudents();
  }, [queryStudentId]);

  // Load attendance summary when selected student changes
  const loadSummary = useCallback(async () => {
    if (!selectedStudentId) {
      setSummary(null);
      return;
    }

    try {
      setLoadingSummary(true);
      setError(null);
      const data = await attendanceApi.getStudentSummary(Number(selectedStudentId));
      setSummary(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load attendance summary for student');
      }
    } finally {
      setLoadingSummary(false);
    }
  }, [selectedStudentId]);

  useEffect(() => {
    if (selectedStudentId) {
      loadSummary();
    }
  }, [selectedStudentId, loadSummary]);

  const getPercentageColor = (pct: number) => {
    if (pct >= 80) return '#10b981'; // Green
    if (pct >= 60) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const handleExportStudentExcel = () => {
    if (!summary) return;
    const currentStudent = students.find((s) => s.id === summary.studentId) || null;
    exportStudentAttendanceToExcel(summary, currentStudent);
    setSuccessMessage(`Excel spreadsheet for "${summary.studentName}" (.xls) downloaded successfully!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleExportStudentCsv = () => {
    if (!summary) return;
    const currentStudent = students.find((s) => s.id === summary.studentId) || null;
    exportAttendanceToCsv(summary, currentStudent);
    setSuccessMessage(`CSV attendance file for "${summary.studentName}" (.csv) downloaded successfully!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleExportAllExcel = async () => {
    try {
      setExportingAll(true);
      setError(null);
      const allSummaries = await attendanceApi.getAllSummaries();
      exportAllStudentsAttendanceToExcel(allSummaries, students);
      setSuccessMessage('Institute Master Attendance Sheet (.xls) for all students downloaded successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Failed to export master attendance sheet: ' + err.message);
      } else {
        setError('Failed to export master attendance sheet');
      }
    } finally {
      setExportingAll(false);
    }
  };

  const currentStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div>
      {/* Page Header with Master Sheet Export Action */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Student Attendance &amp; Analytics</h1>
          <p className="page-description">
            View attendance records, attendance percentage, and export spreadsheets
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={handleExportAllExcel}
            disabled={exportingAll || students.length === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              border: '1px solid rgba(16, 185, 129, 0.3)',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              color: '#34d399',
            }}
            title="Download full attendance master sheet for all students in Excel format"
          >
            <span style={{ fontSize: '16px' }}>📊</span>
            {exportingAll ? 'Generating Master Sheet...' : 'Export All Students Master Sheet (.xls)'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <span>{error}</span>
          <button className="btn btn-sm btn-secondary" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>✓ {successMessage}</span>
          <button className="btn btn-sm btn-secondary" onClick={() => setSuccessMessage(null)}>Dismiss</button>
        </div>
      )}

      {/* Student Selector Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0, minWidth: '320px', flex: 1, maxWidth: '540px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Select Student</label>
            <select
              className="form-select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              disabled={loadingStudents}
            >
              <option value="" disabled>-- Choose a student to inspect --</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} (NIC: {student.nic} | Email: {student.email})
                </option>
              ))}
            </select>
          </div>

          {currentStudent && (
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', paddingBottom: '4px' }}>
              <div><strong>NIC:</strong> <span style={{ color: '#fff' }}>{currentStudent.nic}</span></div>
              <div><strong>Email:</strong> <span style={{ color: '#fff' }}>{currentStudent.email}</span></div>
              <div><strong>Phone:</strong> <span style={{ color: '#fff' }}>{currentStudent.phone}</span></div>
            </div>
          )}
        </div>
      </div>

      {loadingSummary ? (
        <div className="card">
          <div className="empty-state">Calculating attendance summary and fetching history...</div>
        </div>
      ) : summary ? (
        <div>
          {/* Attendance Percentage Metric Meter */}
          <div className="meter-container">
            <div
              className="percentage-badge"
              style={{ color: getPercentageColor(summary.attendancePercentage) }}
            >
              {summary.attendancePercentage}
              <span>%</span>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                  Overall Attendance Rate ({summary.studentName})
                </span>
                <span
                  className="badge"
                  style={{
                    backgroundColor: `${getPercentageColor(summary.attendancePercentage)}20`,
                    color: getPercentageColor(summary.attendancePercentage),
                    border: `1px solid ${getPercentageColor(summary.attendancePercentage)}50`,
                    fontWeight: 600,
                  }}
                >
                  {summary.attendancePercentage >= 80 ? 'Good Standing' : summary.attendancePercentage >= 60 ? 'Warning' : 'Low Attendance'}
                </span>
              </div>

              <div className="progress-bar-bg" style={{ marginTop: '10px' }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${summary.attendancePercentage}%`,
                    backgroundColor: getPercentageColor(summary.attendancePercentage),
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '24px', marginTop: '14px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Total Sessions: <strong style={{ color: '#fff' }}>{summary.totalSessions}</strong>
                </span>
                <span style={{ color: '#34d399' }}>
                  Present: <strong style={{ color: '#fff' }}>{summary.presentCount}</strong>
                </span>
                <span style={{ color: '#f87171' }}>
                  Absent: <strong style={{ color: '#fff' }}>{summary.absentCount}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Attendance Records Table with Dedicated Export Controls */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                  Attendance History Log
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Detailed session attendance and status for {summary.studentName}
                </p>
              </div>

              {/* Export Button Group */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleExportStudentExcel}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    padding: '8px 16px',
                    fontWeight: 600,
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
                  }}
                  title="Export this student's records to Microsoft Excel format (.xls)"
                >
                  <span>📗</span>
                  <span>Export to Excel (.xls)</span>
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={handleExportStudentCsv}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    padding: '8px 14px',
                    fontWeight: 500,
                  }}
                  title="Export this student's records to universal CSV format (.csv)"
                >
                  <span>📄</span>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {summary.records.length === 0 ? (
              <div className="empty-state">
                <p>No attendance records logged for this student yet.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Record ID</th>
                      <th>Date</th>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.records.map((rec) => (
                      <tr key={rec.id}>
                        <td>#{rec.id}</td>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{rec.attendanceDate}</td>
                        <td>
                          <span className="badge badge-course">{rec.courseCode}</span>
                        </td>
                        <td>{rec.courseName}</td>
                        <td>
                          <span
                            className={rec.status === 'Present' ? 'badge badge-present' : 'badge badge-absent'}
                          >
                            {rec.status === 'Present' ? '✓ Present' : '✗ Absent'}
                          </span>
                        </td>
                        <td style={{ color: rec.remarks ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {rec.remarks || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">Please select a student to view attendance records.</div>
        </div>
      )}
    </div>
  );
}

export default function StudentAttendancePage() {
  return (
    <Suspense fallback={<div className="card"><div className="empty-state">Loading attendance module...</div></div>}>
      <StudentAttendanceContent />
    </Suspense>
  );
}
