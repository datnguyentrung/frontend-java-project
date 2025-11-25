import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllClassSessions = async () => {
    try {
        const response = await axiosInstance.get(endpoints.classSessions.list);
        // console.log("Class Sessions Response:", response.data.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching class sessions list:", error);
        throw error;
    }
};