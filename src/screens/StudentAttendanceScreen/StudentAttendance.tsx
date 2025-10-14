import { View, Text, StyleSheet } from "react-native";
import { Attendance } from "@/types/AttendanceTypes";
import { Student } from "@/types/training/StudentTypes";
import React, { useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons'
import { getStudentByClassSession } from "@/services/training/studentsService";
import { getStudentAttendanceByClassSession } from "@/services/attendance/studentAttendanceService";
import StatusIcons from "./StatusIcons";
import LoadingScreen from '@screens/LoadingScreen';

type Props = {
    selectedClassSession: string | null,
    status: "attendance" | "evaluation",
    isChangingStatus?: boolean,
    onStatusChangeComplete?: () => void,
}

export default function StudentAttendance({ selectedClassSession, status, isChangingStatus, onStatusChangeComplete }: Props) {
    const [listStudent, setListStudent] = React.useState<Student[]>([]);
    const [listAttendance, setListAttendance] = React.useState<Attendance[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [loadingRecord, setLoadingRecord] = React.useState(false);

    // console.log('listAttendance: ', listAttendance);

    // console.log('listStudent: ', listStudent);

    // 1. Lấy danh sách học sinh
    useEffect(() => {
        if (selectedClassSession) {
            const fetchStudentAttendance = async () => {
                try {
                    setLoading(true);
                    setListStudent([]); // clear trước
                    const students = await getStudentByClassSession(selectedClassSession);
                    setListStudent(students);
                } catch (error) {
                    console.error("Error fetching students:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchStudentAttendance();
        }
    }, [selectedClassSession]);

    // 2. Lấy danh sách điểm danh
    useEffect(() => {
        if (selectedClassSession) {
            const fetchAttendanceRecords = async () => {
                try {
                    const todayLocal = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD
                    const date = new Date(todayLocal);
                    const attendance = await getStudentAttendanceByClassSession(selectedClassSession, date);
                    setListAttendance(attendance);
                } catch (error) {
                    console.error("Error fetching attendance records:", error);
                } finally {
                    // Always reset loadingRecord after fetching, regardless of refreshing state
                    if (loadingRecord) {
                        setLoadingRecord(false);
                    }
                }
            };

            fetchAttendanceRecords();
        }
    }, [selectedClassSession, loadingRecord, isChangingStatus]);

    // Call onStatusChangeComplete when status change is complete and component is rendered
    React.useEffect(() => {
        if (isChangingStatus && listStudent.length > 0 && onStatusChangeComplete) {
            // Small delay to ensure render is complete
            const timer = setTimeout(() => {
                onStatusChangeComplete();
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [isChangingStatus, listStudent.length, onStatusChangeComplete, status]);

    return (
        <View style={styles.container}>
            {loading ? <LoadingScreen />
                : listStudent.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={64} color="#ddd" />
                        <Text style={styles.emptyText}>Chưa có học viên trong lớp này</Text>
                        <Text style={styles.emptySubText}>Vui lòng chọn lớp học khác</Text>
                    </View>
                ) : (
                    listStudent.map((student: Student) => {
                        const attendanceRecord: Attendance | undefined = listAttendance.find(record => record.idStudent === student.personalInfo.idAccount);
                        const hasAttendanceRecord = !!attendanceRecord;

                        const isUpdatableEvaluation = (attendanceRecord?.attendanceInfo.attendanceStatus === 'P'
                            || attendanceRecord?.attendanceInfo.attendanceStatus === 'V')
                            && status === 'evaluation';

                        const isUpdatable = !hasAttendanceRecord || isUpdatableEvaluation;
                        return (
                            <View key={student.personalInfo.idAccount} style={[
                                styles.studentCard,
                                isUpdatable && styles.noRecordCard
                            ]}>
                                <LinearGradient
                                    colors={isUpdatable ? ['#f5f5f5', '#e8e8e8'] : ['#ffffff', '#f8f9fa']}
                                    style={styles.cardGradient}
                                >
                                    {/* Overlay for students without attendance record */}
                                    {!hasAttendanceRecord && (
                                        <View style={styles.noRecordOverlay}>
                                            <View style={styles.noRecordBadge}>
                                                <Ionicons name="alert-circle-outline" size={16} color="#666" />
                                                <Text style={styles.noRecordText}>Chưa điểm danh</Text>
                                            </View>
                                        </View>
                                    )}

                                    {(attendanceRecord?.attendanceInfo.attendanceStatus === 'V' ||
                                        attendanceRecord?.attendanceInfo.attendanceStatus === 'P'
                                    ) && status === 'evaluation' && (
                                            <View style={styles.noRecordOverlay}>
                                                <View style={styles.noRecordBadge}>
                                                    <Ionicons name="alert-circle-outline" size={16} color="#666" />
                                                    <Text style={styles.noRecordText}>Học viên vắng mặt</Text>
                                                </View>
                                            </View>
                                        )}


                                    <View style={[
                                        styles.studentRow,
                                        isUpdatable && styles.studentRowDisabled
                                    ]}>
                                        <View style={styles.studentInfo}>
                                            <View style={styles.avatarContainer}>
                                                <LinearGradient
                                                    colors={isUpdatable ? ['#bbb', '#999'] : ['#667eea', '#764ba2']}
                                                    style={styles.avatar}
                                                >
                                                    <Text style={styles.avatarText}>
                                                        {student.personalInfo.name?.charAt(0)?.toUpperCase() || 'S'}
                                                    </Text>
                                                </LinearGradient>
                                            </View>
                                            <View style={styles.studentDetails}>
                                                <Text style={[
                                                    styles.studentName,
                                                    isUpdatable && styles.studentNameDisabled
                                                ]}>
                                                    {student.personalInfo.name || 'Học viên'}
                                                </Text>
                                                <View style={styles.detailRow}>
                                                    <Ionicons
                                                        name="school-outline"
                                                        size={14}
                                                        color={isUpdatable ? "#999" : "#666"}
                                                    />
                                                    <Text style={[
                                                        styles.studentLevel,
                                                        isUpdatable && styles.studentLevelDisabled
                                                    ]}>
                                                        Cấp độ: {student.academicInfo.beltLevel || 'Chưa cập nhật'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.statusContainer}>
                                            <StatusIcons
                                                status={status}
                                                attendanceRecord={attendanceRecord}
                                                isChangingStatus={isChangingStatus}
                                                isUpdatable={isUpdatable}
                                            // setLoadingRecord={setLoadingRecord}
                                            />
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>
                        );
                    })
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
    studentCard: {
        borderRadius: 12,
        borderLeftColor: '#ff5252',
        borderLeftWidth: 4,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginHorizontal: 5,
        // marginVertical: 4,
    },
    cardGradient: {
        padding: 16,
    },
    studentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        // elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    studentDetails: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    studentLevel: {
        fontSize: 14,
        color: '#666',
        marginLeft: 6,
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    // Styles for students without attendance record
    noRecordCard: {
        borderLeftColor: '#bbb',
        opacity: 0.8,
    },
    noRecordOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
    },
    noRecordBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(150, 150, 150, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(150, 150, 150, 0.3)',
    },
    noRecordText: {
        fontSize: 11,
        color: '#666',
        marginLeft: 4,
        fontWeight: '500',
    },
    studentRowDisabled: {
        opacity: 0.7,
    },
    studentNameDisabled: {
        color: '#999',
    },
    studentLevelDisabled: {
        color: '#bbb',
    },
    // Legacy styles for backward compatibility
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})