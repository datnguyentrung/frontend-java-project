import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import { CoachAttendance } from "@/types/types";

export const getCoachAttendanceByIdCoach = async (id: string | number) => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.coachAttendance.list,
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.coachAttendance.list}`
    // });

    try {
        const response = await axiosInstance.get(endpoints.coachAttendance.detail(id));
        return response.data.data;
    } catch (error) {
        console.error("Error fetching coach attendance:", error);
        throw error;
    }
};

export const getCoachAttendanceByYearAndMonth = async (id: string | number, year: number, month: number) => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.coachAttendance.byYearAndMonth(id),
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.coachAttendance.byYearAndMonth(id)}`
    // });

    try {
        const response = await axiosInstance.get(endpoints.coachAttendance.byYearAndMonth(id), {
            params: { year, month }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching coach attendance by year and month:", error);
        throw error;
    }
};