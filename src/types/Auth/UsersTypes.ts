export interface UserProfile {
    birthDate: Date;
    isActive: boolean;
    name: string;
    phone: string;
    beltLevel: string;
}

export interface UserResponse {
    userInfo: UserInfo;
    userProfile: UserProfile;
}

export interface UserLogin {
    idAccount: string;
    password: string;
    idDevice: string;
}

export interface UserInfo {
    idAccount: string;
    status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
    role: string;
    startDate: Date;
}


export interface User {
    username: string;
    password: string;
    access_token?: string;
    refresh_token?: string;
    info?: UserInfo;
}