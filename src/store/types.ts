import { ReactNode } from 'react';

export interface Feature {
    idFeature: number; // Java
    featureGroup: string; // Java
    title: string;
    roles: string[];
    icon: string;
    active: boolean;
}

export interface Student {
    student_id: string;
    student_name: string;
    student_level: string;
    birth_date: Date;
    branch: number;
    class_session_id: string[];
    phone: string;
    is_active: boolean;
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