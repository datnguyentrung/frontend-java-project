import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import { StudentMarkAttendance, StudentMarkEvaluation } from "@/types/attendance/StudentAttendanceTypes";

export const getStudentAttendanceByClassSession = async (classSessionId: string, date: Date | null) => {
    try {
        const response = await axiosInstance.get(endpoints.studentAttendance.classSession, {
            params: {
                idClassSession: classSessionId,
                attendanceDate: date ? date.toISOString().split('T')[0] : null,// Chuyển đổi sang định dạng 'YYYY-MM-DD'
            }
        });
        // console.log("Branch List Response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching branch list:", error);
        throw error;
    }
};

export const markAttendanceAPI = async (attendanceData: StudentMarkAttendance) => {
    try {
        const response = await axiosInstance.patch(endpoints.studentAttendance.attendance, attendanceData);
        return response.data.data;
    } catch (error) {
        console.error("Error marking attendance:", error);
        throw error;
    }
};


export const markEvaluationAPI = async (evaluationData: StudentMarkEvaluation) => {
    try {
        const response = await axiosInstance.patch(endpoints.studentAttendance.evaluation, evaluationData);
        return response.data.data;
    } catch (error) {
        console.error("Error marking evaluation:", error);
        throw error;
    }
};

export const getAttendancesByIdAccountAndQuarter = async (studentId: string, year: number, quarter: number) => {
    try {
        const response = await axiosInstance.get(endpoints.studentAttendance.attendancesByIdAccountAndQuarter, {
            params: {
                idAccount: studentId,
                year,
                quarter
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching students by year and quarter:", error);
        throw error;
    }
};