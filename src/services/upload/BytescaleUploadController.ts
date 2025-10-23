import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const createBytescaleSignedUrl = async ({ folderName, fileName }: { folderName: string, fileName: string }) => {
    const response = await axiosInstance.post(endpoints.bytescaleUpload.signedUrl, {
        folderName,
        fileName
    });
    return response.data;
}