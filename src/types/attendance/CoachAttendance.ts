export interface CreateRequest {
    createdAt: Date;
    fileName?: string;
    idClassSession: string;
    idAccount?: string;
}

export interface CoachAttendanceResponse {
    idAttendance: string;
    idCoach: string;
    idClassSession: string;
    imageUrl: string;
    createdAt: Date;
}