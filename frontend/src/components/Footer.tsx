'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Col 1: Institute Brand & Info */}
          <div className="footer-col-brand">
            <div className="footer-brand-header">
              <div className="footer-brand-badge">A</div>
              <div>
                <div className="footer-title">Applebay Institute</div>
                <div className="footer-tagline">Academic Excellence &amp; Student Information System</div>
              </div>
            </div>
            <p className="footer-desc">
              Applebay Institute is dedicated to providing high quality higher education, practical skills training,
              and academic tracking for modern career readiness.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <div className="footer-heading">Quick Links</div>
            <ul className="footer-links">
              <li>
                <Link href="/">Dashboard</Link>
              </li>
              <li>
                <Link href="/courses">Courses</Link>
              </li>
              <li>
                <Link href="/students">Student Directory</Link>
              </li>
              <li>
                <Link href="/enrolments">Course Enrolments</Link>
              </li>
              <li>
                <Link href="/attendance/mark">Mark Attendance</Link>
              </li>
              <li>
                <Link href="/attendance/student">Student Attendance</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus & Academic Support */}
          <div className="footer-col">
            <div className="footer-heading">Academic Services</div>
            <ul className="footer-links">
              <li>
                <span style={{ color: 'var(--text-secondary)' }}>Academic Inquiries: info@applebay.edu</span>
              </li>
              <li>
                <span style={{ color: 'var(--text-secondary)' }}>Student Affairs: registrar@applebay.edu</span>
              </li>
              <li>
                <span style={{ color: 'var(--text-secondary)' }}>Admissions: Mon &ndash; Fri (8:30 AM &ndash; 5:00 PM)</span>
              </li>
              <li>
                <span style={{ color: 'var(--text-secondary)' }}>Campus: Colombo Academic Center</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            &copy; 2026 Applebay Institute. All rights reserved.
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Academic Management Portal
          </div>
        </div>
      </div>
    </footer>
  );
}
