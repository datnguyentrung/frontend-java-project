import { ClassSession } from "@/types/training/ClassSessionTypes";

export interface CreateRequest {
    createdAt: Date;
    fileName?: string;
    idClassSession: string;
    idAccount?: string;
}

export interface CoachAttendanceKey {
    idUser: string;
    idClassSession: string;
    attendanceDate: Date;
}

export interface CoachAttendanceRes {
    name: string;
    createdAt: Date;
    classSession: ClassSession;
    imageFileName?: string;
}