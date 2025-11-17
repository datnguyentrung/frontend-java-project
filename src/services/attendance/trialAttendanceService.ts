import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import { formatDateYMD } from "@/utils/format";
import { AttendanceInfo } from "@/types/attendance/AttendanceTypes";
import { TrialMarkEvaluation } from "@/types/attendance/TrialAttendanceTypes";

export const createTrialAttendance = async (request: AttendanceInfo) => {
    console.log("Creating Trial Attendance with request:", request);
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
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching today's trial attendance:", error);
        throw error;
    }
};

export const markEvaluation = async (evaluation: TrialMarkEvaluation) => {
    try {
        const response = await axiosInstance.patch(endpoints.trialAttendance.evaluation, evaluation);
        return response.data.data;
    } catch (error) {
        console.error("Error marking evaluation:", error);
        throw error;
    }
};