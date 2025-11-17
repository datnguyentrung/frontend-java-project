import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllFeatures = async () => {
    try {
        const response = await axiosInstance.get(endpoints.feature.list);
        // console.log("Feature List Response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching feature list:", error);
        throw error;
    }
};

export const getFeatureDetail = async (id: string | number) => {
    try {
        const response = await axiosInstance.get(endpoints.feature.detail(id));
        return response.data.data;
    } catch (error) {
        console.error("Error fetching feature detail:", error);
        throw error;
    }
};