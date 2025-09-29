import axiosInstanceAI from "@/api/axiosInstanceAI";
import { endpoints } from "@/api/endpoints";

export const sendEmbedding = async (embedding: Float32Array) => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.embedding.send,
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.embedding.send}`
    // });

    try {
        // const response = await axiosInstanceAI.post(endpoints.embedding.send, {
        //     embedding: Array.from(embedding)
        // });
        // return response.data;
        console.log("✅ Embedding to send:", embedding.slice(0, 5), "...");
    } catch (error) {
        console.error("Error sending embedding:", error);
        throw error;
    }
};