import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllRegistration = async () => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.registration.list,
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.registration.list}`
    // });

    try {
        const response = await axiosInstance.get(endpoints.registration.list);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching registration list:", error);
        throw error;
    }
};