export interface UserInfo {
    idUser: string;
    idAccount: string;
    email: string;
    idRole: string;
}

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