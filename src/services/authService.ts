import axiosInstance from '../api/axiosInstance';
import { endpoints } from '../api/endpoints';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    status: boolean;
    statusText: string;
    statusCode?: number;
    message?: string;
    data?: {
        access_token: string;
        refresh_token: string;
        token_type: string;
        user: {
            email: string;
            name: string;
            idUser: string;
            role: string;
        };
    };
}

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

/**
 * API call for user login
 */
export const loginAPI = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post(endpoints.auth.login, credentials);
        console.log("Login API Response:", response.data);

        // response.data đã chứa structure: { access_token, refresh_token, token_type, user }
        return {
            // status: true,
            // statusText: 'Success',
            // data: response.data
            ...response.data
        };
    } catch (error: any) {
        console.log("Login API Error:", error.response?.data);
        // Handle API errors
        if (error.response?.data) {
            return {
                status: false,
                statusText: error.response.statusText || 'Error',
                data: undefined
            };
        }

        // Handle network errors
        return {
            status: false,
            statusText: 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.',
        };
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
