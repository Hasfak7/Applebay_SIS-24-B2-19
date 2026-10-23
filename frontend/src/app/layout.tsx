import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Applebay Institute - Academic Management System',
  description: 'Full-stack course, student, enrolment, and attendance management portal for Applebay Institute',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="site-layout">
          <Navbar />
          <main className="main-content-layout">
            <div className="main-container">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
