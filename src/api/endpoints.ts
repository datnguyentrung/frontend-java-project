const API_PREFIX = "/api/v1";

export const endpoints = {
    auth: {
        login: `${API_PREFIX}/auth/login`,
        register: `${API_PREFIX}/auth/register`,
        refreshToken: `${API_PREFIX}/auth/refresh`,
    },
    user: {
        list: `${API_PREFIX}/users/`,  // ✅ Thêm trailing slash
        update: `${API_PREFIX}/users/update`,
    },
    products: {
        list: `${API_PREFIX}/products`,
        detail: (id: string | number) => `${API_PREFIX}/products/${id}`,
    },
    feature: {
        list: `${API_PREFIX}/features`,
        detail: (id: string | number) => `${API_PREFIX}/features/${id}`,
    },
    branch: {
        list: `${API_PREFIX}/branches`,
        detail: (id: string | number) => `${API_PREFIX}/branches/${id}`,
    },
    classSessions: {
        list: `${API_PREFIX}/class-sessions/`,
        detail: (id: string | number) => `${API_PREFIX}/class-sessions/${id}`,
    },
    students: {
        list: `${API_PREFIX}/students/`,
        detail: (id: string | number) => `${API_PREFIX}/students/${id}`,
        branch: (id: string | number) => `${API_PREFIX}/students/branch/${id}`,
    }
};