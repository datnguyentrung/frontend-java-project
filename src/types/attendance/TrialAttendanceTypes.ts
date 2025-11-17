import { AttendanceInfo } from '@/types/attendance/AttendanceTypes';
import { RegistrationDTO } from '@/types/RegistrationTypes';

export interface TrialAttendanceKey {
    idRegistration: string;
    idClassSession: string;
    attendanceDate: Date;
}

export interface TrialMarkAttendance {
    attendanceKey: TrialAttendanceKey;
    attendanceStatus: string; // "X", "V", "M", "P", "B"
}

export interface TrialMarkEvaluation {
    attendanceKey: TrialAttendanceKey;
    evaluationStatus: string; // "T", "TB", "Y"
    notes?: string;
}

export interface TrialAttendanceDetail extends AttendanceInfo {
    registrationDTO: RegistrationDTO;
    attendanceDate: Date;
}