import { UserInfo } from './UsersTypes';

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface RefreshTokenResponse {
    success: boolean;
    data?: {
        access_token: string;
        refresh_token: string;
    };
}

export interface LoginResponseData {
    access_token: string;
    refresh_token: string;
    idDevice: string;
    user: UserInfo;
}

export interface LoginAPIResponse {
    data: LoginResponseData;
    error: string | null;
    message: string;
    statusCode?: number;
    status?: number;
}