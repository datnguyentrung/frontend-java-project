import mime from "mime";
import axiosInstance from "../api/axiosInstance";
import { endpoints } from "../api/endpoints";

const accountId = process.env.EXPO_PUBLIC_BYTESCALE_ACCOUNT_ID || '';
const publicKey = process.env.EXPO_PUBLIC_BYTESCALE_PUBLIC_KEY || '';
/**
 * Helper function to get MIME type from file URI
 */
export const getMimeType = (fileUri: string): string => {
    try {
        // Extract file extension
        const extension = fileUri.split('.').pop()?.toLowerCase();

        // Manual MIME type mapping for common types
        const mimeMap: { [key: string]: string } = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt': 'text/plain',
            'mp4': 'video/mp4',
            'mov': 'video/quicktime',
            'avi': 'video/x-msvideo'
        };

        if (extension && mimeMap[extension]) {
            return mimeMap[extension];
        }

        // Fallback to mime library if available
        return (mime as any).getType?.(fileUri) || 'application/octet-stream';
    } catch (error) {
        console.warn('Failed to detect MIME type:', error);
        return 'application/octet-stream';
    }
};

/**
 * Upload file response from Bytescale
 */
interface BytescaleUploadResponse {
    fileUrl?: string;
    url?: string; // Alternative field name
    accountId?: string;
    filePath?: string;
    fileId?: string;
    originalFileName?: string;
    size?: number;
    mime?: string;
    [key: string]: any; // Allow other fields
}

/**
 * Get Bytescale auth token from backend
 * @param fileName - Name of the file to upload
 * @param folderName - Folder name for organizing uploads
 * @returns Promise with JWT token string
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

        // The backend returns a raw JWT string, not JSON
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

/**
 * Upload options for Bytescale
 */
interface UploadOptions {
    timeout?: number;
    retries?: number;
    onProgress?: (progress: number) => void;
    maxFileSizeMB?: number;
}

/**
 * File validation result
 */
interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Upload error with detailed information
 */
class UploadError extends Error {
    constructor(
        message: string,
        public status?: number,
        public response?: any
    ) {
        super(message);
        this.name = 'UploadError';
    }
}

/**
 * Upload file to Bytescale with proper error handling and type safety
 * 
 * @param fileUri - Local file URI to upload (from React Native image picker)
 * @param mimeType - MIME type of the file
 * @param fileName - Name of the file to upload
 * @param authToken - JWT token from getBytescaleAuthToken function
 * @param options - Upload configuration options
 * @returns Promise with uploaded file URL
 */
export const uploadToBytescale = async (
    fileUri: string,
    mimeType: string,
    fileName: string,
    authToken: string,
    options: UploadOptions = {}
): Promise<string> => {
    const { timeout = 30000, retries = 3, maxFileSizeMB = 10 } = options;

    // Thêm log này để xem API key
    console.log('Using Public Key:', publicKey ? 'Public key provided' : 'No Public key');
    console.log('Account ID from env:', accountId);
    console.log('Auth Token (JWT) received:', authToken ? 'Token provided' : 'No token');

    // Validate inputs
    if (!fileUri || !authToken) {
        throw new UploadError('Missing required parameters: fileUri and authToken');
    }

    if (!accountId || !publicKey) { // Sửa: kiểm tra cả publicKey
        throw new UploadError('EXPO_PUBLIC_BYTESCALE_ACCOUNT_ID hoặc EXPO_PUBLIC_BYTESCALE_PUBLIC_KEY env var is not set');
    }

    // Validate file before upload
    const validation = validateFileAdvanced(fileUri, maxFileSizeMB);
    if (!validation.isValid) {
        throw new UploadError(`File validation failed: ${validation.error}`);
    }

    // Use provided MIME type or detect from file URI
    const finalMimeType = mimeType || getMimeType(fileUri);
    console.log('📎 Uploading file:', fileUri, 'MIME:', finalMimeType, 'FileName:', fileName);

    const uploadUrl = `https://api.bytescale.com/v2/accounts/${accountId}/uploads/form_data`;

    // Retry logic for better reliability
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`📤 Upload attempt ${attempt}/${retries}...`);
            const uploadFormData = new FormData();

            const file = {
                uri: fileUri,
                type: finalMimeType,
                name: fileName
            } as any;

            // Thêm đối tượng 'file' này vào FormData
            uploadFormData.append('file', file);

            // Thêm 'authorization' (JWT) như cũ
            uploadFormData.append('authorization', authToken);

            const response = await Promise.race([
                fetch(uploadUrl, {
                    method: 'POST',
                    body: uploadFormData,
                    headers: {
                        // *** THAY ĐỔI QUAN TRỌNG ***
                        // Header Authorization phải là PUBLIC API KEY
                        'Authorization': `Bearer ${publicKey}`,
                        // --------------------------
                    },
                }),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('Upload timeout')), timeout)
                )
            ]);

            console.log('📡 Response status:', response.status);

            // Lấy response text để debug nếu parse JSON lỗi
            const responseText = await response.text();

            if (!response.ok) {
                const errorText = responseText || 'Unknown error';
                console.error('❌ Upload response error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText,
                    url: uploadUrl
                });
                throw new UploadError(
                    `Upload failed: ${response.status} ${response.statusText} - ${errorText}`,
                    response.status,
                    errorText
                );
            }

            const data: BytescaleUploadResponse = JSON.parse(responseText);

            // Log the full response to understand the structure
            console.log('📋 Bytescale response data:', JSON.stringify(data, null, 2));

            // 1. Kiểm tra xem mảng 'files' có tồn tại không
            if (!data.files || !Array.isArray(data.files) || data.files.length === 0) {
                console.error('❌ No "files" array found in response');
                throw new UploadError('Invalid response: "files" array is missing or empty');
            }

            // 2. Tìm đối tượng 'file' thực sự trong mảng
            const fileData = data.files.find(
                (f: BytescaleUploadResponse) => f.formDataFieldName === 'file'
            );

            // 3. Kiểm tra xem file đó và 'fileUrl' có tồn tại không
            if (!fileData || !fileData.fileUrl) {
                console.error('❌ "fileUrl" not found for the "file" field in response');
                throw new UploadError('Invalid response: "fileUrl" not found for the "file" field');
            }

            // 4. Trả về fileUrl chính xác
            console.log('✅ Upload successful:', fileData.fileUrl);
            return fileData.fileUrl;
        } catch (error) {
            const isLastAttempt = attempt === retries;

            if (error instanceof UploadError) {
                console.error(`❌ Upload attempt ${attempt} failed:`, error.message);
                if (isLastAttempt) throw error;
            } else if (error instanceof Error) {
                console.error(`❌ Network error on attempt ${attempt}:`, error.message);
                if (isLastAttempt) {
                    throw new UploadError(`Upload failed after ${retries} attempts: ${error.message}`);
                }
            } else {
                console.error(`❌ Unknown error on attempt ${attempt}:`, error);
                if (isLastAttempt) {
                    throw new UploadError('Upload failed with unknown error');
                }
            }

            // Wait before retry (exponential backoff)
            if (!isLastAttempt) {
                const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s...
                console.log(`⏳ Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    // This should never be reached, but TypeScript requires it
    throw new UploadError('Upload failed unexpectedly');
};

/**
 * Complete upload workflow: Get auth token and upload file
 * @param fileUri - Local file URI to upload
 * @param fileName - Name of the file to upload  
 * @param folderName - Folder name for organizing uploads
 * @param mimeType - Optional MIME type (will be detected if not provided)
 * @param options - Upload configuration options
 * @returns Promise with uploaded file URL
 */
export const uploadFileWithAuth = async (
    fileUri: string,
    fileName: string,
    folderName: string,
    mimeType?: string,
    options: UploadOptions = {}
): Promise<string> => {
    try {
        // Step 1: Get auth token from backend
        const authToken = await getBytescaleAuthToken(fileName, folderName);

        // Step 2: Upload file to Bytescale
        const detectedMimeType = mimeType || getMimeType(fileUri);
        const fileUrl = await uploadToBytescale(fileUri, detectedMimeType, fileName, authToken, options);

        return fileUrl;
    } catch (error) {
        console.error('❌ Complete upload failed:', error);
        throw error;
    }
};

/**
 * Advanced file validation with detailed error messages
 */
export const validateFileAdvanced = (fileUri: string, maxSizeMB: number = 10): ValidationResult => {
    if (!fileUri) {
        return { isValid: false, error: 'Invalid file URI' };
    }

    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.txt'];
    const extension = fileUri.toLowerCase().substring(fileUri.lastIndexOf('.'));

    if (!allowedExtensions.includes(extension)) {
        return {
            isValid: false,
            error: `Unsupported file type: ${extension}. Allowed: ${allowedExtensions.join(', ')}`
        };
    }

    // Additional validation can be added here (file size, etc.)
    console.log('✅ Advanced file validation passed');
    return { isValid: true };
};

/**
 * Helper function to validate file before upload (backward compatibility)
 */
export const validateFile = (fileUri: string, maxSizeMB: number = 10): boolean => {
    const result = validateFileAdvanced(fileUri, maxSizeMB);
    if (!result.isValid) {
        console.error('❌', result.error);
    }
    return result.isValid;
};

/**
 * Helper function to get file size (if available in React Native)
 */
export const getFileInfo = (fileUri: string) => {
    const filename = fileUri.split('/').pop() || 'unknown';
    const extension = filename.substring(filename.lastIndexOf('.') + 1);
    const mimeType = getMimeType(fileUri);

    return {
        filename,
        extension,
        mimeType,
        uri: fileUri
    };
};