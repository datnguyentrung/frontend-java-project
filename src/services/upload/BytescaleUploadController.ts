import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

/**
 * Lấy một "vé" (JWT) ủy quyền upload từ backend
 * @param fileName - Tên file sẽ được upload
 * @param folderName - Tên thư mục để tổ chức file upload
 * @returns Promise với JWT token string
 */
export const getBytescaleAuthToken = async (
    fileName: string,
    folderName: string
): Promise<string> => {
    try {
        console.log('🎫 Requesting auth token for:', { fileName, folderName });

        const response = await axiosInstance.post(endpoints.bytescaleUpload.authToken, {
            fileName,
            folderName
        });

        // Backend trả về raw JWT string, không phải JSON
        const authToken = response.data;

        if (!authToken || typeof authToken !== 'string') {
            throw new Error('Invalid auth token received from backend');
        }

        console.log('✅ Auth token received successfully');
        return authToken;
    } catch (error) {
        console.error('❌ Failed to get auth token:', error);
        throw new Error(`Failed to get upload authorization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};