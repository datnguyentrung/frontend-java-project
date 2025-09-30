import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get(endpoints.user.me);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};
