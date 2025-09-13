import { ReactNode } from 'react';

export interface Feature {
    idFeature: number; // Java
    featureGroup: string; // Java
    title: string;
    roles: string[];
    icon: string;
    active: boolean;
}

export interface FeatureWithIcon extends Feature {
    iconComponent: any;
}

export interface Student {
    idStudent: string;
    name: string;
    studentLevel: string;
    birthday: Date;
    idBranch: number;
    idClassSession: string[];
    phone: string;
    active: boolean;
}

export interface Attendance {
    id: string;
    date: Date;
    idClassSession: string;
    attendanceStatus: string; // "X", "V", "M", "P", "B"
    evaluationStatus: string; // "T", "TB", "Y"
}

export interface BasicAttendance {
    idStudent: string;
    date: Date;
    idClassSession: string;
    attendance: string;
    evaluation: string;
    note: string;

    // Nếu cần trả về từ backend:
    attendanceTime: string;
    attendanceCoach: string;
    evaluationCoach: string;
}

export interface MarkAttendance {
    idStudent: string;
    idClassSession: string;
    date: Date;
    attendanceStatus: string; // "X", "V", "M", "P", "B"
}

export interface MarkEvaluation {
    idStudent: string;
    idClassSession: string;
    date: Date;
    evaluationStatus: string; // "T", "TB", "Y"
}

export interface UserInfo {
    idUser?: string;
    email?: string;
    name?: string;
    role?: string;
}

export interface User {
    username: string;
    password: string;
    access_token?: string;
    refresh_token?: string;
    info?: UserInfo;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    userInfo: UserInfo | null;
    user: User | null;
    access_token: string | null;
    isLoading: boolean;
    signIn: (userData: User) => Promise<void>;
    signOut: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
    updateTokens: (access_token: string, refresh_token?: string) => Promise<void>;
    getAccessToken: () => Promise<string | null>;
}


export interface AuthProviderProps {
    children: ReactNode;
}

export interface Branch {
    idBranch: number;
    title: string;
    address: string;
    weekdays: string[];
    avatar?: string;
    isNew: boolean;
}

export interface ClassSession {
    idClassSession: string;
    location: string;
    shift: number;
    classLevel: string;
    idBranch: number;
    weekday: number;
    active: boolean;
    session: string
}

export interface ConductScore {
    absentSession: number,
    late: number,
    excusedAbsence: number,
    compensatorySession: number,
    trainingSession: number,
    score: number
}

export interface AwarenessScore {
    highScore: number;
    mediumScore: number;
    lowScore: number;
    score: number;
}

export interface BonusScore {
    trainingScore: number;
    contributionScore: ContributionScore;
    achievementScore: AchievementScore;
    score: number;
}

export interface ContributionScore {
    memberCard: number;
    tuition: number;
    video: number;
    score: number;
}

export interface AchievementScore {
    skillStrengthScore: number;
    medalScore: number;
    score: number;
}

export interface Summary {
    conductScore: ConductScore;
    awarenessScore: AwarenessScore;
    bonusScore: BonusScore;
    score: number;
}

export interface GOATPointsSummaryByYear {
    year: number;
    quarter: number;
    summary: Summary;
}

export interface ScoreDataType {
    type: string,
    awarenessScore?: AwarenessScore | null,
    conductScore?: ConductScore | null,
    quarter: number,
    year: number,
    listAttendance: BasicAttendance[]
}