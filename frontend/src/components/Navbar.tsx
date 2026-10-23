'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'Students', href: '/students' },
    { label: 'Enrolments', href: '/enrolments' },
    { label: 'Mark Attendance', href: '/attendance/mark' },
    { label: 'Student Attendance', href: '/attendance/student' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link href="/" className="navbar-brand">
          <div className="navbar-brand-badge">A</div>
          <div className="navbar-brand-text">
            <span className="navbar-title">Applebay Institute</span>
            <span className="navbar-subtitle">Academic Management Portal</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-menu">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link ${isActive ? 'active' : ''}`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side status & Mobile toggle */}
        <div className="navbar-right">
          <div className="navbar-status-pill">
            <span className="status-dot-pulse" />
            <span className="status-text">System Active</span>
          </div>

          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-mobile-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
