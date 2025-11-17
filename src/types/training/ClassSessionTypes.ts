export interface ClassSessionInfo {
    classLevel: string;
    location: string;
    shift: string;
    weekday: string;
    session: string;
    isActive: boolean;
    idBranch: number;
}

export interface ClassSession extends ClassSessionInfo {
    idClassSession: string;
}

export interface ClassSessionDetails extends ClassSessionInfo {
    value: string;
    label: string;
}