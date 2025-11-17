import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/providers/AuthProvider';
import { AntDesign, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { markAttendanceAPI, markEvaluationAPI } from '@/services/attendance/studentAttendanceService';
import { useMutation } from "@tanstack/react-query";
import { parseAxiosError } from '@/utils/errorUtils';
import {
    StudentAttendanceDetail, StudentMarkAttendance, StudentMarkEvaluation,
} from '@/types/attendance/StudentAttendanceTypes';

const attendanceData = [
    {
        key: 'X',
        label: 'Có mặt',
        role: ['COACH'],
        iconComponent: <AntDesign name="check" size={20} color="white" />,
        activeColors: ['#4CAF50', '#66BB6A'] as const,
        inactiveColors: ['#f8fff8ff', '#f8fff0ff'] as const,
        textColor: '#86db8bff',
    },
    {
        key: 'V',
        label: 'Vắng mặt',
        role: ['COACH'],
        iconComponent: <AntDesign name="close" size={20} color="white" />,
        activeColors: ['#F44336', '#EF5350'] as const,
        inactiveColors: ['#fff8f9ff', '#FFF5F5'] as const,
        textColor: '#C62828',
    },
    {
        key: 'M',
        label: 'Muộn',
        role: ['COACH'],
        iconComponent: <MaterialIcons name="access-time" size={20} color="white" />,
        activeColors: ['#FF9800', '#FFB74D'] as const,
        inactiveColors: ['#fff6e8ff', '#fffaf5ff'] as const,
        textColor: '#E65100',
    },
    {
        key: 'P',
        label: 'Phép',
        role: ['ADMIN'],
        iconComponent: <FontAwesome5 name="calendar-check" size={18} color="white" />,
        activeColors: ['#2196F3', '#42A5F5'] as const,
        inactiveColors: ['#E3F2FD', '#F0F8FF'] as const,
        textColor: '#1565C0',
    },
    {
        key: 'B',
        label: 'Học bù',
        role: ['ADMIN'],
        iconComponent: <FontAwesome5 name="redo" size={18} color="white" />,
        activeColors: ['#9C27B0', '#BA68C8'] as const,
        inactiveColors: ['#F3E5F5', '#FAF0FF'] as const,
        textColor: '#6A1B9A',
    },
];

const evaluationData = [
    {
        key: 'T',
        label: 'Tốt',
        iconComponent: <AntDesign name="like" size={20} color="white" />,
        activeColors: ['#4CAF50', '#66BB6A'] as const,
        inactiveColors: ['#E8F5E8', '#F1F8E9'] as const,
        textColor: '#2E7D32'
        // textColor: '#ffffffff',
    },
    {
        key: 'TB',
        label: 'Trung bình',
        iconComponent: <AntDesign name="meh" size={20} color="white" />,
        activeColors: ['#FF9800', '#FFB74D'] as const,
        inactiveColors: ['#FFF3E0', '#FFF8F1'] as const,
        textColor: '#E65100',
        // textColor: '#ffffffff',
    },
    {
        key: 'Y',
        label: 'Yếu',
        iconComponent: <AntDesign name="dislike" size={20} color="white" />,
        activeColors: ['#F44336', '#EF5350'] as const,
        inactiveColors: ['#FFEBEE', '#FFF5F5'] as const,
        textColor: '#C62828',
        // textColor: '#ffffffff',
    },
];

type Props = {
    status: string;
    attendanceRecord?: StudentAttendanceDetail;
    isChangingStatus?: boolean;
    isUpdatable?: boolean;
};

export default function StatusIcons({ status, attendanceRecord, isChangingStatus, isUpdatable }: Props) {
    const { userInfo } = useAuth();
    const role = userInfo?.role || '';

    console.log("Rendering StatusIcons with attendanceRecord:", attendanceRecord);

    // Local state for optimistic updates
    const [localAttendanceStatus, setLocalAttendanceStatus] = React.useState<string | null>(null);
    const [localEvaluationStatus, setLocalEvaluationStatus] = React.useState<string | null>(null);

    // Reset local state when attendanceRecord changes
    React.useEffect(() => {
        setLocalAttendanceStatus(null);
        setLocalEvaluationStatus(null);
    }, [attendanceRecord]);

    const handleMarkAttendance = async ({ newStatus }: { newStatus: string }) => {
        if (!attendanceRecord) {
            throw new Error("No attendance record found");
        }

        console.log(`🔄 Marking attendance: ${attendanceRecord} -> ${newStatus}`);

        const updatedRecord: StudentMarkAttendance = {
            attendanceAccountKey: {
                idAccount: attendanceRecord.idAccount,
                idClassSession: attendanceRecord.idClassSession,
                attendanceDate: attendanceRecord.attendanceDate,
            },
            attendanceStatus: newStatus
        };

        const result = await markAttendanceAPI(updatedRecord);
        console.log(`✅ Attendance API response:`, result);
        return result;
    }

    const handleMarkEvaluation = async ({ newStatus }: { newStatus: string }) => {
        if (!attendanceRecord) {
            throw new Error("No attendance record found");
        }

        console.log(`🔄 Marking evaluation: ${attendanceRecord} -> ${newStatus}`);

        const updatedRecord: StudentMarkEvaluation = {
            attendanceAccountKey: {
                idAccount: attendanceRecord.idAccount,
                idClassSession: attendanceRecord.idClassSession,
                attendanceDate: attendanceRecord.attendanceDate,
            },
            evaluationStatus: newStatus,
            notes: attendanceRecord.notes
        };

        const result = await markEvaluationAPI(updatedRecord);
        console.log(`✅ Evaluation API response:`, result);
        return result;
    }

    const mutationMarkAttendance = useMutation({
        mutationFn: (newStatus: string) => handleMarkAttendance({ newStatus }),
        onMutate: async (newStatus) => {
            console.log("📝 Attendance marking...");
            // Optimistic update - update UI immediately
            setLocalAttendanceStatus(newStatus);
        },
        onSuccess: (data, newStatus) => {
            console.log(`✅ Attendance marked successfully: ${newStatus}`);
            // Trigger refresh to update attendanceRecord from server
            // setLoadingRecord(true);
        },
        onError: (error, newStatus) => {
            console.error(`❌ Error marking attendance (${newStatus}):`, error);
            // Revert optimistic update on error
            setLocalAttendanceStatus(null);
        }
    });

    const mutationMarkEvaluation = useMutation({
        mutationFn: (newStatus: string) => handleMarkEvaluation({ newStatus }),
        onMutate: async (newStatus) => {
            console.log("📊 Evaluation marking...");
            // Optimistic update - update UI immediately
            setLocalEvaluationStatus(newStatus);
        },
        onSuccess: (data, newStatus) => {
            console.log(`✅ Evaluation marked successfully: ${newStatus}`);
            // Trigger refresh to update attendanceRecord from server
            // setLoadingRecord(true);
        },
        onError: (error, newStatus) => {
            const { status } = parseAxiosError(error);
            if (status === 400) {
                Alert.alert('Lỗi',
                    "Không thể cập nhật đánh giá. Vui lòng kiểm tra lại."
                );
                // Optionally show a user-friendly message here
            }
            console.error(`❌ Error marking evaluation (${newStatus}):`, error);
            // Revert optimistic update on error
            setLocalEvaluationStatus(null);
        }
    });

    function renderEvaluationIcon() {
        return (
            <View style={styles.iconsContainer}>
                {evaluationData.map((item) => {
                    // Use local state for immediate UI update, fallback to attendanceRecord
                    const currentStatus = localEvaluationStatus || attendanceRecord?.evaluation.evaluationStatus;
                    const isActive = item.key === currentStatus;
                    return (
                        <Pressable
                            key={item.key}
                            style={styles.iconButton}
                            onPress={() => {
                                if (!mutationMarkEvaluation.isPending && !isChangingStatus) {
                                    mutationMarkEvaluation.mutate(item.key);
                                }
                            }}
                            disabled={mutationMarkEvaluation.isPending || isChangingStatus || isUpdatable}
                        >
                            <LinearGradient
                                colors={isActive ? item.activeColors : item.inactiveColors}
                                style={[styles.iconGradient, isActive && styles.activeIconGradient]}
                            >
                                {isActive ? item.iconComponent : (
                                    <View style={styles.inactiveIcon}>
                                        {React.cloneElement(item.iconComponent, {
                                            color: isActive ? "#fff" : item.textColor,
                                            size: 20
                                        })}
                                    </View>
                                )}
                            </LinearGradient>
                        </Pressable>
                    );
                })}
            </View>
        );
    }

    function renderAttendanceIcon() {
        const filteredData = attendanceData.filter(item => item.role.includes(role));
        return (
            <View style={styles.iconsContainer}>
                {filteredData.map((item) => {
                    // Use local state for immediate UI update, fallback to attendanceRecord
                    const currentStatus = localAttendanceStatus || attendanceRecord?.attendance.attendanceStatus;
                    const isActive = item.key === currentStatus;
                    return (
                        <Pressable
                            key={item.key}
                            style={styles.iconButton}
                            onPress={() => {
                                if (!mutationMarkAttendance.isPending && !isChangingStatus) {
                                    mutationMarkAttendance.mutate(item.key);
                                }
                            }}
                            disabled={mutationMarkAttendance.isPending || isChangingStatus || isUpdatable}
                        >
                            <LinearGradient
                                colors={isActive ? item.activeColors : item.inactiveColors}
                                style={[styles.iconGradient, isActive && styles.activeIconGradient]}
                            >
                                {isActive ? item.iconComponent : (
                                    <View style={styles.inactiveIcon}>
                                        {React.cloneElement(item.iconComponent, {
                                            color: isActive ? "#fff" : item.textColor,
                                            size: 20
                                        })}
                                    </View>
                                )}
                            </LinearGradient>
                        </Pressable>
                    );
                })}
            </View>
        );
    }

    return (
        <View style={[
            styles.container,
            isChangingStatus && styles.changingStatusContainer
        ]}>
            {status === "evaluation" ? renderEvaluationIcon() : renderAttendanceIcon()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // Base container style
    },
    changingStatusContainer: {
        opacity: 0.6,
        // Add subtle animation effect when changing status
    },
    iconsContainer: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    iconButton: {
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 25,
    },
    iconGradient: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    activeIconGradient: {
        // elevation: 4,
        shadowOpacity: 0.2,
    },
    inactiveIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Legacy styles for backward compatibility
    row: {
        gap: 20,
        alignContent: 'center',
    },
    icon: {
        padding: 10,
        borderRadius: 50,
    }
});