import { AttendanceRecord, StudentAttendanceSummary, Student } from '@/types';

// Helper to escape XML special characters
function escapeXml(str: string | number | null | undefined): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Download file in browser
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates an Excel SpreadsheetML (.xls) for a Single Student Attendance Record
 */
export function exportStudentAttendanceToExcel(
  summary: StudentAttendanceSummary,
  studentDetails?: Student | null
) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString();

  const statusLabel =
    summary.attendancePercentage >= 80
      ? 'Good Standing'
      : summary.attendancePercentage >= 60
      ? 'Warning (Borderline)'
      : 'Critical (<60%)';

  const statusColor =
    summary.attendancePercentage >= 80
      ? '#10b981'
      : summary.attendancePercentage >= 60
      ? '#f59e0b'
      : '#ef4444';

  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="11" ss:Color="#1e293b"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="TitleStyle">
   <Font ss:FontName="Segoe UI" ss:Size="16" ss:Bold="1" ss:Color="#0f172a"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SubtitleStyle">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Italic="1" ss:Color="#64748b"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="MetaLabel">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#475569"/>
   <Interior ss:Color="#f1f5f9" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
   </Borders>
  </Style>
  <Style ss:ID="MetaValue">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#0f172a"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
   </Borders>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#ffffff"/>
   <Interior ss:Color="#1e3a8a" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0f172a"/>
   </Borders>
  </Style>
  <Style ss:ID="RowStyle">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1e293b"/>
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e2e8f0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e2e8f0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e2e8f0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e2e8f0"/>
   </Borders>
  </Style>
  <Style ss:ID="PresentStyle">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#065f46"/>
   <Interior ss:Color="#d1fae5" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#a7f3d0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#a7f3d0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#a7f3d0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#a7f3d0"/>
   </Borders>
  </Style>
  <Style ss:ID="AbsentStyle">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#991b1b"/>
   <Interior ss:Color="#fee2e2" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#fecaca"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#fecaca"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#fecaca"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#fecaca"/>
   </Borders>
  </Style>
  <Style ss:ID="PctStyle">
   <Font ss:FontName="Segoe UI" ss:Size="12" ss:Bold="1" ss:Color="#1e3a8a"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Attendance Log">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="70"/>
   <Column ss:Width="100"/>
   <Column ss:Width="90"/>
   <Column ss:Width="200"/>
   <Column ss:Width="100"/>
   <Column ss:Width="220"/>

   <!-- Title Row -->
   <Row ss:Height="28">
    <Cell ss:MergeAcross="5" ss:StyleID="TitleStyle">
     <Data ss:Type="String">APPLEBAY INSTITUTE - STUDENT ATTENDANCE REPORT</Data>
    </Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="5" ss:StyleID="SubtitleStyle">
     <Data ss:Type="String">Generated on: ${dateStr} at ${timeStr} | Official Academic Record</Data>
    </Cell>
   </Row>
   <Row ss:Height="10"/>

   <!-- Student Profile & Metric Summary -->
   <Row>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Student Name</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${escapeXml(summary.studentName)}</Data></Cell>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Student ID</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="Number">${summary.studentId}</Data></Cell>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Attendance Rate</Data></Cell>
    <Cell ss:StyleID="PctStyle"><Data ss:Type="String">${summary.attendancePercentage}%</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">NIC Number</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${escapeXml(studentDetails?.nic || 'N/A')}</Data></Cell>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Email</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${escapeXml(studentDetails?.email || 'N/A')}</Data></Cell>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Standing Status</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${statusLabel}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Total Sessions</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="Number">${summary.totalSessions}</Data></Cell>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Present Count</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="Number">${summary.presentCount}</Data></Cell>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Absent Count</Data></Cell>
    <Cell ss:StyleID="MetaValue"><Data ss:Type="Number">${summary.absentCount}</Data></Cell>
   </Row>
   <Row ss:Height="14"/>

   <!-- Data Table Headers -->
   <Row ss:Height="24">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Record ID</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Date</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Course Code</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Course Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Status</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Remarks</Data></Cell>
   </Row>
`;

  if (summary.records && summary.records.length > 0) {
    summary.records.forEach((rec) => {
      const isPresent = rec.status === 'Present';
      xml += `   <Row>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="Number">${rec.id || 0}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(rec.attendanceDate)}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(rec.courseCode)}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(rec.courseName)}</Data></Cell>
    <Cell ss:StyleID="${isPresent ? 'PresentStyle' : 'AbsentStyle'}"><Data ss:Type="String">${rec.status}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(rec.remarks || '—')}</Data></Cell>
   </Row>
`;
    });
  } else {
    xml += `   <Row>
    <Cell ss:MergeAcross="5" ss:StyleID="RowStyle"><Data ss:Type="String">No attendance records logged for this student.</Data></Cell>
   </Row>
`;
  }

  xml += `  </Table>
 </Worksheet>
</Workbook>`;

  const cleanName = summary.studentName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Applebay_Attendance_${cleanName}_${dateStr}.xls`;
  downloadFile(xml, filename, 'application/vnd.ms-excel');
}

/**
 * Generates an Excel Master Sheet (.xls) for All Students
 */
export function exportAllStudentsAttendanceToExcel(
  summaries: StudentAttendanceSummary[],
  studentsList?: Student[]
) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString();

  // Create student map for fast lookup of email and nic
  const studentMap = new Map<number, Student>();
  if (studentsList) {
    studentsList.forEach((s) => {
      if (s.id) studentMap.set(s.id, s);
    });
  }

  // Calculate Institute Metrics
  const totalStudents = summaries.length;
  const avgPct =
    totalStudents > 0
      ? (
          summaries.reduce((acc, curr) => acc + curr.attendancePercentage, 0) /
          totalStudents
        ).toFixed(2)
      : '0.00';
  const totalSessionsLogged = summaries.reduce(
    (acc, curr) => acc + curr.totalSessions,
    0
  );
  const totalPresents = summaries.reduce(
    (acc, curr) => acc + curr.presentCount,
    0
  );

  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="11" ss:Color="#1e293b"/>
  </Style>
  <Style ss:ID="TitleStyle">
   <Font ss:FontName="Segoe UI" ss:Size="16" ss:Bold="1" ss:Color="#0f172a"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SubtitleStyle">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Italic="1" ss:Color="#64748b"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="KpiLabel">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#475569"/>
   <Interior ss:Color="#f8fafc" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
   </Borders>
  </Style>
  <Style ss:ID="KpiValue">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#0f172a"/>
   <Interior ss:Color="#f1f5f9" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#cbd5e1"/>
   </Borders>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#ffffff"/>
   <Interior ss:Color="#0f172a" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#020617"/>
   </Borders>
  </Style>
  <Style ss:ID="RowStyle">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1e293b"/>
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e2e8f0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e2e8f0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e2e8f0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e2e8f0"/>
   </Borders>
  </Style>
  <Style ss:ID="GoodStanding">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#065f46"/>
   <Interior ss:Color="#d1fae5" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#a7f3d0"/>
   </Borders>
  </Style>
  <Style ss:ID="WarningStanding">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#92400e"/>
   <Interior ss:Color="#fef3c7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#fde68a"/>
   </Borders>
  </Style>
  <Style ss:ID="CriticalStanding">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#991b1b"/>
   <Interior ss:Color="#fee2e2" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#fecaca"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Master Attendance">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="65"/>
   <Column ss:Width="160"/>
   <Column ss:Width="110"/>
   <Column ss:Width="180"/>
   <Column ss:Width="95"/>
   <Column ss:Width="80"/>
   <Column ss:Width="80"/>
   <Column ss:Width="105"/>
   <Column ss:Width="130"/>

   <!-- Title Row -->
   <Row ss:Height="28">
    <Cell ss:MergeAcross="8" ss:StyleID="TitleStyle">
     <Data ss:Type="String">APPLEBAY INSTITUTE - COMPREHENSIVE ATTENDANCE MASTER SHEET</Data>
    </Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="8" ss:StyleID="SubtitleStyle">
     <Data ss:Type="String">Generated on: ${dateStr} at ${timeStr} | Master Student Cohort Report</Data>
    </Cell>
   </Row>
   <Row ss:Height="10"/>

   <!-- KPI Overview -->
   <Row>
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">Total Students</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${totalStudents}</Data></Cell>
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">Cohort Avg Attendance</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="String">${avgPct}%</Data></Cell>
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">Total Logs Recorded</Data></Cell>
    <Cell ss:MergeAcross="3" ss:StyleID="KpiValue"><Data ss:Type="Number">${totalSessionsLogged}</Data></Cell>
   </Row>
   <Row ss:Height="14"/>

   <!-- Table Headers -->
   <Row ss:Height="24">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Student ID</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Student Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">NIC</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Email Address</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Total Sessions</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Present</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Absent</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Attendance %</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Academic Standing</Data></Cell>
   </Row>
`;

  summaries.forEach((s) => {
    const student = studentMap.get(s.studentId);
    const nic = student?.nic || '—';
    const email = student?.email || '—';
    const pct = s.attendancePercentage;

    let standingClass = 'GoodStanding';
    let standingText = 'Good Standing (>=80%)';
    if (pct < 60) {
      standingClass = 'CriticalStanding';
      standingText = 'Critical (<60%)';
    } else if (pct < 80) {
      standingClass = 'WarningStanding';
      standingText = 'Warning (60-79%)';
    }

    xml += `   <Row>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="Number">${s.studentId}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(s.studentName)}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(nic)}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(email)}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="Number">${s.totalSessions}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="Number">${s.presentCount}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="Number">${s.absentCount}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${pct}%</Data></Cell>
    <Cell ss:StyleID="${standingClass}"><Data ss:Type="String">${standingText}</Data></Cell>
   </Row>
`;
  });

  xml += `  </Table>
 </Worksheet>
</Workbook>`;

  const filename = `Applebay_Master_Attendance_Summary_${dateStr}.xls`;
  downloadFile(xml, filename, 'application/vnd.ms-excel');
}

/**
 * Fallback / Universal CSV Exporter (UTF-8 with BOM for 100% Excel compatibility)
 */
export function exportAttendanceToCsv(
  summary: StudentAttendanceSummary,
  studentDetails?: Student | null
) {
  const dateStr = new Date().toISOString().split('T')[0];
  const rows: string[][] = [
    ['APPLEBAY INSTITUTE - ATTENDANCE REPORT'],
    ['Generated On', new Date().toLocaleString()],
    [''],
    ['Student Name', summary.studentName],
    ['Student ID', String(summary.studentId)],
    ['NIC', studentDetails?.nic || 'N/A'],
    ['Email', studentDetails?.email || 'N/A'],
    ['Total Sessions', String(summary.totalSessions)],
    ['Present Count', String(summary.presentCount)],
    ['Absent Count', String(summary.absentCount)],
    ['Attendance Rate', `${summary.attendancePercentage}%`],
    [''],
    ['Record ID', 'Date', 'Course Code', 'Course Name', 'Status', 'Remarks'],
  ];

  summary.records.forEach((r) => {
    rows.push([
      String(r.id || ''),
      r.attendanceDate,
      r.courseCode,
      r.courseName,
      r.status,
      r.remarks || '',
    ]);
  });

  const csvContent =
    '\uFEFF' +
    rows
      .map((row) =>
        row
          .map((col) => `"${String(col).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\r\n');

  const cleanName = summary.studentName.replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadFile(
    csvContent,
    `Applebay_Attendance_${cleanName}_${dateStr}.csv`,
    'text/csv;charset=utf-8;'
  );
}
