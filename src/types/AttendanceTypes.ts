export interface Attendance {
    idAttendance?: string;
    idStudent: string;
    studentName?: string;
    idClassSession: string;
    attendanceInfo: AttendanceInfo;
}

export interface AttendanceInfo {
    attendanceDate: Date;
    attendanceStatus: string; // "X", "V", "M", "P", "B"
    evaluationStatus: string; // "T", "TB", "Y"
    notes: string;
}

export interface MarkAttendance {
    idAttendance: string;
    attendanceStatus: string; // "X", "V", "M", "P", "B"
}

export interface MarkEvaluation {
    idAttendance: string;
    evaluationStatus: string; // "T", "TB", "Y"
    note?: string;
}