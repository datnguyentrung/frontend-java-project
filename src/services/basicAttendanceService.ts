import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import { MarkAttendance, MarkEvaluation } from "@/store/types";

export const getBasicAttendanceByClassSession = async (classSessionId: string, date: Date | null) => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.branch.list,
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.branch.list}`
    // });

    try {
        const response = await axiosInstance.get(endpoints.basicAttendance.classSession(classSessionId), {
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
    //     endpoint: endpoints.basicAttendance.attendance(attendanceData),
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.basicAttendance.attendance(attendanceData)}`
    // });
    try {
        const response = await axiosInstance.put(endpoints.basicAttendance.attendance(attendanceData), attendanceData);
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
    //     endpoint: endpoints.basicAttendance.attendance(attendanceData),
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.basicAttendance.attendance(attendanceData)}`
    // });
    try {
        const response = await axiosInstance.put(endpoints.basicAttendance.evaluation(evaluationData), evaluationData);
        return response.data;
    } catch (error) {
        console.error("Error marking evaluation:", error);
        throw error;
    }
};