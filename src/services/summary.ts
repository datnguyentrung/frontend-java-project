import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getGOATPointsByIdStudentAndYear = async (studentId: string, year: number) => {
    // // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.summary.quarterSummaryByIdStudentAndYear(studentId, year),
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.summary.quarterSummaryByIdStudentAndYear(studentId, year)}`
    // });

    try {
        const response = await axiosInstance.get(endpoints.summary.quarterSummaryByIdStudentAndYear(studentId, year));
        // console.log("GOAT Points Response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching GOAT points:", error);
        throw error;
    }
};