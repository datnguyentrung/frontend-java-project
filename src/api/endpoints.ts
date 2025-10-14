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
        me: `${API_PREFIX}/users/me`,
    },
    summary: {
        list: `${API_PREFIX}/summary`,
        quarterSummaryByIdStudentAndYear: (id: string | number, year: string | number) =>
            `${API_PREFIX}/summary/students/${id}/goat-points/${year}/quarters`,
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
        list: `${API_PREFIX}/class-sessions`,
        detail: (id: string | number) => `${API_PREFIX}/class-sessions/${id}`,
    },
    students: {
        list: `${API_PREFIX}/students`,
        detail: (id: string | number) => `${API_PREFIX}/students/${id}`,
        branch: (id: string | number) => `${API_PREFIX}/students/branch/${id}`,
        classSession: (id: string | number) => `${API_PREFIX}/students/class-session/${id}`,
        startDate: (id: string | number) => `${API_PREFIX}/students/start-date/${id}`,
    },
    studentAttendance: {
        list: `${API_PREFIX}/student-attendance`,
        detail: (id: string | number) => `${API_PREFIX}/student-attendance/${id}`,
        classSession: (id: string | number) => `${API_PREFIX}/student-attendance/class-session/${id}`,
        attendance: `${API_PREFIX}/student-attendance/attendance`,
        evaluation: `${API_PREFIX}/student-attendance/evaluation`,
        studentByYearAndQuarter: (id: string | number) =>
            `${API_PREFIX}/student-attendance/students/${id}`,
    },
    coachAttendance: {
        list: `${API_PREFIX}/coach-attendance`,
        detail: (id: string | number) => `${API_PREFIX}/coach-attendance/${id}`,
        byYearAndMonth: (id: string | number) => `${API_PREFIX}/coach-attendance/${id}/year-month`
    },
    trialAttendance: {
        list: `${API_PREFIX}/trial-attendance`,
        create: `${API_PREFIX}/trial-attendance`,
        evaluation: `${API_PREFIX}/trial-attendance/evaluation`,
        today: `${API_PREFIX}/trial-attendance/today`,
        date: (date: string) => `${API_PREFIX}/trial-attendance/date/${date}`,
    },
    embedding: {
        send: `${API_PREFIX}/embeddings`,
    },
    registration: {
        list: `${API_PREFIX}/registration`,
        create: `${API_PREFIX}/registration`,
        update: `${API_PREFIX}/registration/update`,
    }
};