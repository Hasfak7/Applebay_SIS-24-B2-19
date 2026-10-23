package com.applebay.institute.dto;

import java.util.List;

public class StudentAttendanceSummaryDto {

    private Long studentId;
    private String studentName;
    private long totalSessions;
    private long presentCount;
    private long absentCount;
    private double attendancePercentage;
    private List<AttendanceRecordDto> records;

    public StudentAttendanceSummaryDto() {
    }

    public StudentAttendanceSummaryDto(Long studentId, String studentName, long totalSessions,
                                      long presentCount, long absentCount, double attendancePercentage,
                                      List<AttendanceRecordDto> records) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.totalSessions = totalSessions;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
        this.attendancePercentage = attendancePercentage;
        this.records = records;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public long getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(long totalSessions) {
        this.totalSessions = totalSessions;
    }

    public long getPresentCount() {
        return presentCount;
    }

    public void setPresentCount(long presentCount) {
        this.presentCount = presentCount;
    }

    public long getAbsentCount() {
        return absentCount;
    }

    public void setAbsentCount(long absentCount) {
        this.absentCount = absentCount;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public List<AttendanceRecordDto> getRecords() {
        return records;
    }

    public void setRecords(List<AttendanceRecordDto> records) {
        this.records = records;
    }
}
