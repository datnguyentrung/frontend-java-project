import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

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

export interface UserLogin {
    idAccount: string;
    password: string;
    idDevice: string;
}

export interface UserInfo {
    idAccount: string;
    role: string;
    status: string;
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

/**
 * API call for user login
 */
export const loginAPI = async (credentials: UserLogin): Promise<LoginAPIResponse | undefined> => {
    try {
        const response = await axiosInstance.post(endpoints.auth.login, credentials);
        console.log("Login API Response:", response.data);

        // response.data đã chứa structure: { access_token, refresh_token, token_type, user }
        return response.data;
    } catch (error: any) {
        // Nếu có phản hồi từ server
        if (error.response) {
            const apiError = error.response.data;
            // console.log("Login API Error Response:", apiError);
            return apiError;
        }
    }
};

/**
 * API call for refresh token
 */
export const refreshTokenAPI = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
        const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh', {
            refreshToken,
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }

        return {
            success: false,
        };
    }
};

/**
 * API call for logout
 */
export const logoutAPI = async (accessToken: string): Promise<{ success: boolean }> => {
    try {
        const response = await axiosInstance.post('/auth/logout', {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return { success: true };
    } catch (error) {
        // Even if logout API fails, we should still clear local storage
        return { success: true };
    }
};

/**
 * API call to verify token validity
 */
export const verifyTokenAPI = async (accessToken: string): Promise<{ valid: boolean }> => {
    try {
        const response = await axiosInstance.get('/auth/verify', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return { valid: true };
    } catch (error) {
        return { valid: false };
    }
};
