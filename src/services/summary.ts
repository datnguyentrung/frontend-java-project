import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getScoresByQuarter = async (year: number, quarter: number, studentId: string) => {
    try {
        const response = await axiosInstance.get(endpoints.scores.summaryByQuarter, {
            params: {
                year,
                quarter,
                idAccount: studentId
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching GOAT points:", error);
        throw error;
    }
};