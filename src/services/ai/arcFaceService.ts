import axiosInstanceAI from "@/api/axiosInstanceAI";
import { endpoints } from "@/api/endpoints";

export const recognizeCoach = async (image_base64: string, threshold = 0.5) => {
    try {
        const payload = {
            image_base64,
            threshold
        };

        const response = await axiosInstanceAI.post(
            endpoints.arcFace.recognizeFaceBase64,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error recognizing coach:", error);
        throw error;
    }
};
