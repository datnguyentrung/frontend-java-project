import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import { MarkEvaluation, Attendance } from "@/types/AttendanceTypes";
import { formatDateYMD } from "@/utils/format";

export const createTrialAttendance = async (request: Attendance) => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.branch.list,
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.markAttendanceTrial.create}`
    // });

    try {
        const response = await axiosInstance.post(endpoints.trialAttendance.create, request);
        // console.log("Branch List Response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching branch list:", error);
        throw error;
    }
};

export const getTrialAttendanceByDate = async (date: Date) => {
    try {
        const response = await axiosInstance.get(endpoints.trialAttendance.date(formatDateYMD(date)));
        return response.data.data;
    } catch (error) {
        console.error("Error fetching trial attendance by date:", error);
        throw error;
    }
};

export const getTodayTrialAttendance = async () => {
    try {
        const response = await axiosInstance.get(endpoints.trialAttendance.today);
        // console.log("Today's Trial Attendance Response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching today's trial attendance:", error);
        throw error;
    }
};

export const markEvaluation = async (evaluation: MarkEvaluation) => {
    try {
        const response = await axiosInstance.patch(endpoints.trialAttendance.evaluation, evaluation);
        return response.data.data;
    } catch (error) {
        console.error("Error marking evaluation:", error);
        throw error;
    }
};