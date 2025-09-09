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
    idClassSession: string;
    attendanceStatus: string; // "X", "V", "M", "P", "B"
    evaluationStatus: string; // "T", "TB", "Y"
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