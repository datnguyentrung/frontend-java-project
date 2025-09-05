import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllFeatures = async () => {
    // Debug logging
    console.log('🔧 Debug Info:', {
        baseURL: axiosInstance.defaults.baseURL,
        endpoint: endpoints.feature.list,
        fullURL: `${axiosInstance.defaults.baseURL}${endpoints.feature.list}`
    });

    try {
        const response = await axiosInstance.get(endpoints.feature.list);
        // console.log("Feature List Response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching feature list:", error);
        throw error;
    }
};