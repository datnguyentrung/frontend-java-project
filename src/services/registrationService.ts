import { RegistrationDTO } from './../types/RegistrationTypes';
import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import { PersonalInfo } from "@/types/RegistrationTypes";

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

export const createRegistration = async (registrationData: PersonalInfo) => {
    try {
        const response = await axiosInstance.post(endpoints.registration.create, registrationData);
        return response.data.data;
    } catch (error) {
        console.error("Error creating registration:", error);
        throw error;
    }
};

export const updateRegistration = async (registrationData: RegistrationDTO) => {
    try {
        const response = await axiosInstance.post(endpoints.registration.update, registrationData);
        return response.data.data;
    } catch (error) {
        console.error("Error updating registration:", error);
        throw error;
    }
};
