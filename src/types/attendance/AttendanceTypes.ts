export type AttendanceStatus = "X" | "V" | "M" | "P" | "B"; // Absent, Present, Late, Excused, Other
export type EvaluationStatus = "T" | "TB" | "Y"; // Poor, Average, Good

export interface CoachReference {
    coachId: string;
    coachName: string;
}

export interface AttendanceDetail {
    attendanceTime: string;
    attendanceStatus: AttendanceStatus;
    coach: CoachReference | null;
}

export interface EvaluationDetail {
    evaluationStatus: EvaluationStatus | null;
    coach: CoachReference | null;
}

export interface AttendanceInfo {
    idAccount: string;
    idClassSession: string;

    attendance: AttendanceDetail;
    evaluation: EvaluationDetail;

    notes: string;
}