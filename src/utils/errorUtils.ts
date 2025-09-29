import { AxiosError } from "axios";

export function parseAxiosError(error: unknown) {
    const axiosError = error as AxiosError<any>;
    return {
        status: axiosError.response?.status ?? 500,
        message: axiosError.response?.data?.message ?? axiosError.message,
        data: axiosError.response?.data
    };
}
