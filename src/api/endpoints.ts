const API_VERSION_1 = "/api/v1";

export const endpoints = {
    auth: {
        login: `${API_VERSION_1}/auth/login`,
        register: `${API_VERSION_1}/auth/register`,
        refreshToken: `${API_VERSION_1}/auth/refresh`,
    },
    user: {
        list: `${API_VERSION_1}/users/`,  // ✅ Thêm trailing slash
        update: `${API_VERSION_1}/users/update`,
        me: `${API_VERSION_1}/users/me`,
    },
    summary: {
        list: `${API_VERSION_1}/summary`,
        quarterSummaryByIdStudentAndYear: (id: string | number, year: string | number) =>
            `${API_VERSION_1}/summary/students/${id}/goat-points/${year}/quarters`,
    },
    scores: {
        summaryByQuarter: `${API_VERSION_1}/scores/quarter-summary`,
    },
    feature: {
        list: `${API_VERSION_1}/features`,
        detail: (id: string | number) => `${API_VERSION_1}/features/${id}`,
    },
    branch: {
        list: `${API_VERSION_1}/branches`,
        detail: (id: string | number) => `${API_VERSION_1}/branches/${id}`,
    },
    classSessions: {
        list: `${API_VERSION_1}/class-sessions`,
        detail: (id: string | number) => `${API_VERSION_1}/class-sessions/${id}`,
    },
    students: {
        list: `${API_VERSION_1}/students`,
        detail: (id: string | number) => `${API_VERSION_1}/students/${id}`,
        branch: (id: string | number) => `${API_VERSION_1}/students/branch/${id}`,
        classSession: (id: string | number) => `${API_VERSION_1}/students/class-session/${id}`,
        startDate: (id: string | number) => `${API_VERSION_1}/students/start-date/${id}`,
    },
    studentAttendance: {
        list: `${API_VERSION_1}/student-attendance`,
        detail: (id: string | number) => `${API_VERSION_1}/student-attendance/${id}`,
        classSession: `${API_VERSION_1}/student-attendance/class-session`,
        attendance: `${API_VERSION_1}/student-attendance/attendance`,
        evaluation: `${API_VERSION_1}/student-attendance/evaluation`,
        attendancesByIdAccountAndQuarter: `${API_VERSION_1}/student-attendance/quarter`,
    },
    coachAttendance: {
        list: `${API_VERSION_1}/coach-attendance`,
        detail: (id: string | number) => `${API_VERSION_1}/coach-attendance/${id}`,
        byYearAndMonth: (id: string | number) => `${API_VERSION_1}/coach-attendance/${id}/year-month`,
        create: `${API_VERSION_1}/coach-attendance`,
    },
    trialAttendance: {
        list: `${API_VERSION_1}/trial-attendance`,
        create: `${API_VERSION_1}/trial-attendance`,
        evaluation: `${API_VERSION_1}/trial-attendance/evaluation`,
        today: `${API_VERSION_1}/trial-attendance/today`,
        date: (date: string) => `${API_VERSION_1}/trial-attendance/date/${date}`,
    },
    embedding: {
        send: `${API_VERSION_1}/embeddings`,
    },
    registration: {
        list: `${API_VERSION_1}/registration`,
        create: `${API_VERSION_1}/registration`,
        update: `${API_VERSION_1}/registration/update`,
    },
    bytescaleUpload: {
        signedUrl: `${API_VERSION_1}/bytescale-upload`,
    },
    arcFace: {
        recognizeFaceBase64: `${API_VERSION_1}/arcface-ai/recognize/base64`,
    }
};