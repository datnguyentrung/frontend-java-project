import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllClassSessions = async ({ isActive }: { isActive: boolean | null }) => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.classSessions.list,
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.classSessions.list}`
    // });

    try {
        const response = await axiosInstance.get(endpoints.classSessions.list, {
            params: {
                isActive
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching class sessions list:", error);
        throw error;
    }
};