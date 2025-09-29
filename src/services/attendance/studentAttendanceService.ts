import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import { MarkAttendance, MarkEvaluation } from "@/types/AttendanceTypes";

export const getStudentAttendanceByClassSession = async (classSessionId: string, date: Date | null) => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.branch.list,
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.branch.list}`
    // });

    try {
        const response = await axiosInstance.get(endpoints.studentAttendance.classSession(classSessionId), {
            params: { date: date ? date.toISOString().split('T')[0] : null } // Sending date as YYYY-MM-DD
        });
        // console.log("Branch List Response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching branch list:", error);
        throw error;
    }
};

export const markAttendanceAPI = async (attendanceData: MarkAttendance) => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.studentAttendance.attendance(attendanceData),
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.studentAttendance.attendance(attendanceData)}`
    // });
    try {
        const response = await axiosInstance.patch(endpoints.studentAttendance.attendance, attendanceData);
        return response.data;
    } catch (error) {
        console.error("Error marking attendance:", error);
        throw error;
    }
};


export const markEvaluationAPI = async (evaluationData: MarkEvaluation) => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.studentAttendance.attendance(attendanceData),
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.studentAttendance.attendance(attendanceData)}`
    // });
    try {
        const response = await axiosInstance.patch(endpoints.studentAttendance.evaluation, evaluationData);
        return response.data;
    } catch (error) {
        console.error("Error marking evaluation:", error);
        throw error;
    }
};

export const getStudentsByYearAndQuarter = async (studentId: string, year: number, quarter: number) => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.studentAttendance.studentByYearAndQuarter(studentId),
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.studentAttendance.studentByYearAndQuarter(studentId)}`
    // });
    try {
        const response = await axiosInstance.get(endpoints.studentAttendance.studentByYearAndQuarter(studentId), {
            params: { year, quarter }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching students by year and quarter:", error);
        throw error;
    }
};