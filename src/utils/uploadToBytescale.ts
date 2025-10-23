import mime from "mime";

/**
 * Helper function to get MIME type from file URI
 */
const getMimeType = (fileUri: string): string => {
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
    fileUrl: string;
    accountId?: string;
    filePath?: string;
    fileId?: string;
    originalFileName?: string;
    size?: number;
    mime?: string;
}

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
 * @param fileUri - Local file URI to upload
 * @param signedUrl - Pre-signed URL from Bytescale API
 * @param options - Upload configuration options
 * @returns Promise with uploaded file URL
 */
export const uploadToBytescale = async (
    fileUri: string,
    signedUrl: string,
    options: UploadOptions = {}
): Promise<string> => {
    const { timeout = 30000, retries = 3, onProgress, maxFileSizeMB = 10 } = options;

    // Validate inputs
    if (!fileUri || !signedUrl) {
        throw new UploadError('Missing required parameters: fileUri and signedUrl');
    }

    // Validate file before upload
    const validation = validateFileAdvanced(fileUri, maxFileSizeMB);
    if (!validation.isValid) {
        throw new UploadError(`File validation failed: ${validation.error}`);
    }

    // Detect MIME type with fallback
    const mimeType = getMimeType(fileUri);
    console.log('📎 Uploading file:', fileUri, 'MIME:', mimeType);

    // Prepare file object for React Native
    const file = {
        uri: fileUri,
        type: mimeType,
        name: fileUri.split('/').pop() || 'upload', // Extract filename
    } as any;

    const formData = new FormData();
    formData.append('file', file);

    // Retry logic for better reliability
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`📤 Upload attempt ${attempt}/${retries}...`);

            const response = await Promise.race([
                fetch(signedUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        // Don't set Content-Type - let browser set it with boundary for FormData
                        'Accept': 'application/json',
                    },
                }),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('Upload timeout')), timeout)
                )
            ]);

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                throw new UploadError(
                    `Upload failed: ${response.status} ${response.statusText}`,
                    response.status,
                    errorText
                );
            }

            const data: BytescaleUploadResponse = await response.json();

            if (!data.fileUrl) {
                throw new UploadError('Invalid response: missing fileUrl');
            }

            console.log('✅ Upload successful:', data.fileUrl);
            return data.fileUrl;

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