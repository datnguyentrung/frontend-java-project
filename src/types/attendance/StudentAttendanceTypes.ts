import { Student } from "../training/StudentTypes";
import { AttendanceInfo } from "./AttendanceTypes";

export interface StudentAttendanceKey {
    idUser: string;
    idClassSession: string;
    attendanceDate: Date;
}

export interface StudentAttendanceAccountKey {
    idAccount: string;
    idClassSession: string;
    attendanceDate: Date;
}

export interface StudentMarkAttendance {
    attendanceAccountKey: StudentAttendanceAccountKey;
    attendanceStatus: string; // "X", "V", "M", "P", "B"
}

export interface StudentMarkEvaluation {
    attendanceAccountKey: StudentAttendanceAccountKey;
    evaluationStatus: string; // "T", "TB", "Y"
    notes?: string;
}

export interface StudentAttendanceDetail extends AttendanceInfo {
    personalAcademicInfo: Student;
}