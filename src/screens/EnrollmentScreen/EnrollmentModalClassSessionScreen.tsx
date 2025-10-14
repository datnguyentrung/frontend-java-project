import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput } from 'react-native';
import { gray, red } from '@styles/colorTypes';
import AntDesign from '@expo/vector-icons/AntDesign';
import { RegistrationDTO } from '@/types/RegistrationTypes';
import { Attendance } from '@/types/AttendanceTypes';
import { createTrialAttendance } from '@/services/attendance/trialAttendanceService';
import Ionicons from '@expo/vector-icons/Ionicons';
import DropDownPicker from "react-native-dropdown-picker";

const { width } = Dimensions.get('window');

type Props = {
    setVisible: (visible: boolean) => void;
    selectedItem: RegistrationDTO | null;
    setRefreshing: (visible: boolean) => void;
}

const attendanceData = [
    { key: 'X', label: 'Có mặt' },
    { key: 'M', label: 'Muộn' },
]

const weekdays = [
    { label: 'Chủ nhật', value: 1 },
    { label: 'Thứ 2', value: 2 },
    { label: 'Thứ 3', value: 3 },
    { label: 'Thứ 4', value: 4 },
    { label: 'Thứ 5', value: 5 },
    { label: 'Thứ 6', value: 6 },
    { label: 'Thứ 7', value: 7 },
]

const branches = [
    { label: 'Cơ sở 1', value: '1' },
    { label: 'Cơ sở 2', value: '2' },
    { label: 'Cơ sở 3', value: '3' },
    { label: 'Cơ sở 4', value: '4' },
    { label: 'Cơ sở 5', value: '5' },
    { label: 'Cơ sở 6', value: '6' },
]

const shiftSession = [
    { session: 'A', shift: 'C1', label: 'Sáng - Ca 1' },
    { session: 'A', shift: 'C2', label: 'Sáng - Ca 2' },
    { session: 'P', shift: 'C1', label: 'Tối - Ca 1' },
    { session: 'P', shift: 'C2', label: 'Tối - Ca 2' },
]

export default function EnrollmentModalClassSessionScreen({ setVisible, selectedItem, setRefreshing }: Props) {
    const [mark, setMark] = React.useState<Attendance>({
        idStudent: selectedItem?.idRegistration || '',
        idClassSession: '', // cần truyền từ props hoặc context
        attendanceInfo: {
            attendanceDate: new Date(),
            attendanceStatus: 'X',
            evaluationStatus: '',
            notes: '',
        }
    });
    const [openWeekday, setOpenWeekday] = React.useState(false);
    const [valueWeekday, setValueWeekday] = React.useState<number | null>(
        new Date().getDay() === 0 ? 1 : new Date().getDay() + 1
    );
    const [itemsWeekday, setItemsWeekday] = React.useState(weekdays);

    const [openBranch, setOpenBranch] = React.useState(false);
    const [valueBranch, setValueBranch] = React.useState<string | null>(null);
    const [itemsBranch, setItemsBranch] = React.useState(branches);

    const [selectedShiftSession, setSelectedShiftSession] = React.useState<string | null>(null);
    const [evaluationStatus, setEvaluationStatus] = React.useState<'Y' | 'TB' | 'T' | ''>('Y');

    // Function to handle dropdown close when other dropdown opens
    React.useEffect(() => {
        if (openWeekday && openBranch) {
            setOpenBranch(false);
        }
    }, [openWeekday]);

    React.useEffect(() => {
        if (openBranch && openWeekday) {
            setOpenWeekday(false);
        }
    }, [openBranch]);

    // Generate idClassSession
    React.useEffect(() => {
        if (selectedShiftSession && valueBranch && valueWeekday) {
            const selectedShift = shiftSession.find(item => `${item.session}_${item.shift}` === selectedShiftSession);
            if (selectedShift) {
                const idClassSession = `${selectedShift.session}${valueBranch}${valueWeekday}${selectedShift.shift}`;
                setMark({ ...mark, idClassSession });
            }
        }
    }, [selectedShiftSession, valueBranch, valueWeekday]);

    const handleEvaluationChange = (rating: 'Y' | 'TB' | 'T') => {
        setEvaluationStatus(rating);
        setMark({ ...mark, attendanceInfo: { ...mark.attendanceInfo, evaluationStatus: rating } });
    };

    const renderStars = () => {
        return [1, 2, 3].map((i) => {
            let color = gray[300];
            if (evaluationStatus === 'Y' && i === 1) color = red[500];
            if (evaluationStatus === 'TB' && i <= 2) color = '#FF8C00';
            if (evaluationStatus === 'T' && i <= 3) color = '#4CAF50';

            return (
                <Pressable
                    key={`star-${i}`}
                    onPress={() => {
                        if (i === 1) handleEvaluationChange('Y');
                        if (i === 2) handleEvaluationChange('TB');
                        if (i === 3) handleEvaluationChange('T');
                    }}
                >
                    <AntDesign name="star" size={24} color={color} />
                </Pressable>
            );
        });
    };

    const getEvaluationText = () => {
        switch (evaluationStatus) {
            case 'Y': return 'Yếu';
            case 'TB': return 'Trung bình';
            case 'T': return 'Tốt';
            default: return 'Chưa đánh giá';
        }
    };

    const handleSubmit = async () => {
        try {
            await createTrialAttendance(mark);
        } catch (error) {
            console.error("Error marking attendance:", error);
        } finally {
            setVisible(false);
            setRefreshing(true);
        }
    }

    // console.log("Mark State:", mark);

    return (
        <View style={styles.card}>
            <View style={styles.headerCard}>
                <Text style={styles.headerText}>Điểm danh tập thử</Text>
                <Pressable style={styles.xButton} onPress={() => setVisible(false)}>
                    <AntDesign name="close" size={16} color="black" />
                </Pressable>
            </View>

            {/* Nội dung modal ở đây */}
            <View style={styles.content}>
                {/* Thông tin học viên */}
                <View style={styles.studentInfo}>
                    <Ionicons name="person-outline" size={18} color={red[800]} style={styles.icon} />
                    <View>
                        <Text style={styles.label}>{selectedItem?.personalInfo.name}</Text>
                        <Text style={{ color: gray[600], fontSize: 12 }}>Giới thiệu: {selectedItem?.personalInfo.referredBy}</Text>
                    </View>
                </View>

                {/* Thông tin lớp học */}
                <View style={styles.section}>
                    {/* Thứ và Cơ sở cùng 1 hàng */}
                    <View style={styles.row}>
                        {/* Thứ */}
                        <View style={styles.halfWidth}>
                            <View style={styles.labelWithIcon}>
                                <Ionicons name="calendar-clear-outline" size={14} color="black" />
                                <Text style={styles.label}>Thứ</Text>
                            </View>
                            <DropDownPicker
                                open={openWeekday}
                                value={valueWeekday}
                                items={itemsWeekday}
                                setOpen={setOpenWeekday}
                                setValue={setValueWeekday}
                                setItems={setItemsWeekday}
                                placeholder='Chọn thứ'
                                placeholderStyle={styles.placeholderStyle}
                                style={styles.dropdownSmall}
                                dropDownContainerStyle={styles.dropdownContainer}
                                arrowIconStyle={styles.arrowIcon}
                                tickIconStyle={styles.tickIcon}
                                listMode="SCROLLVIEW"
                                zIndex={3000}
                                zIndexInverse={1000}
                            />
                        </View>

                        {/* Cơ sở */}
                        <View style={styles.halfWidth}>
                            <View style={styles.labelWithIcon}>
                                <Ionicons name="location-outline" size={14} color="black" />
                                <Text style={styles.label}>Cơ sở</Text>
                            </View>
                            <DropDownPicker
                                open={openBranch}
                                value={valueBranch}
                                items={itemsBranch}
                                setOpen={setOpenBranch}
                                setValue={setValueBranch}
                                setItems={setItemsBranch}
                                placeholder='Chọn cơ sở'
                                placeholderStyle={styles.placeholderStyle}
                                style={styles.dropdownSmall}
                                dropDownContainerStyle={styles.dropdownContainer}
                                arrowIconStyle={styles.arrowIcon}
                                tickIconStyle={styles.tickIcon}
                                listMode="SCROLLVIEW"
                                zIndex={2000}
                                zIndexInverse={2000}
                            />
                        </View>
                    </View>

                    {/* Ca học */}
                    <View style={styles.section}>
                        <View style={styles.labelWithIcon}>
                            <Ionicons name="time-outline" size={14} color="black" />
                            <Text style={styles.label}>Ca học</Text>
                        </View>
                        <View style={styles.shiftButtonsContainer}>
                            {shiftSession.map((item, index) => (
                                <Pressable
                                    key={`shift-${item.session}-${item.shift}`}
                                    style={[
                                        styles.shiftButton,
                                        selectedShiftSession === `${item.session}_${item.shift}` && styles.shiftButtonSelected
                                    ]}
                                    onPress={() => setSelectedShiftSession(`${item.session}_${item.shift}`)}
                                >
                                    <Text style={[
                                        styles.shiftButtonText,
                                        selectedShiftSession === `${item.session}_${item.shift}` && styles.shiftButtonTextSelected
                                    ]}>
                                        {item.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Điểm danh */}
                <View style={styles.section}>
                    <View style={styles.labelWithIcon}>
                        <Ionicons name="checkmark-circle-outline" size={14} color="black" />
                        <Text style={styles.label}>Điểm danh</Text>
                    </View>
                    <View style={styles.attendanceButtons}>
                        {attendanceData.map((item) => (
                            <Pressable
                                key={`attendance-${item.key}`}
                                style={[
                                    styles.attendanceButton,
                                    mark?.attendanceInfo?.attendanceStatus === item.key && styles.attendanceButtonSelected
                                ]}
                                onPress={() => setMark({ ...mark, attendanceInfo: { ...mark.attendanceInfo, attendanceStatus: item.key } })}
                            >
                                <Text style={[
                                    styles.attendanceButtonText,
                                    mark?.attendanceInfo?.attendanceStatus === item.key && styles.attendanceButtonTextSelected
                                ]}>
                                    {item.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Đánh giá */}
                <View style={styles.section}>
                    <View style={styles.labelWithIcon}>
                        <Ionicons name="star-outline" size={14} color="black" />
                        <Text style={styles.label}>Đánh giá buổi tập</Text>
                    </View>
                    <View style={styles.evaluationContainer}>
                        <View style={styles.starsContainer}>
                            {renderStars()}
                        </View>
                        <Text style={styles.evaluationText}>
                            Trạng thái: {getEvaluationText()}
                        </Text>
                    </View>
                </View>

                {/* Ghi chú */}
                <View style={styles.section}>
                    <View style={styles.labelWithIcon}>
                        <Ionicons name="pencil-outline" size={14} color="black" />
                        <Text style={styles.label}>Ghi chú</Text>
                    </View>
                    <TextInput
                        style={styles.noteInput}
                        multiline
                        numberOfLines={4}
                        placeholder="Nhập ghi chú tại đây..."
                        value={mark?.attendanceInfo.notes || ''}
                        onChangeText={(text) => setMark({ ...mark, attendanceInfo: { ...mark.attendanceInfo, notes: text } })}
                    />
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Pressable style={styles.button} onPress={() => setVisible(false)}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Hủy</Text>
                </Pressable>
                <Pressable style={[styles.button, { backgroundColor: red[600] }]} onPress={() => handleSubmit()}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#fff' }}>Điểm danh</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // },
    card: {
        width: width * 0.8,
        // height: height * 0.5,
        backgroundColor: gray[50],
        borderRadius: 10,
        padding: 15,
    },
    headerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: red[700],
    },
    label: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    content: {
        // paddingHorizontal: 20,
    },
    xButton: {

    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        width: width * 0.4 - 30,
        // marginRight: 10,
        // paddingHorizontal: 10,
        // paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#fff',
        borderColor: gray[300],
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    studentInfo: {
        backgroundColor: red[50],
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 5,
        borderRadius: 15,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    attendanceButtons: {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    evaluationButtons: {
        flexDirection: 'row',
        gap: 20,
    },
    noteContainer: {

    },
    icon: {
        backgroundColor: red[100],
        padding: 8,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    dropdownYear: {
        backgroundColor: '#fff',
        borderColor: '#e1e5e9',
        borderWidth: 1,
        borderRadius: 12,
        minHeight: 50,
        paddingHorizontal: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        borderColor: '#e1e5e9',
        borderRadius: 12,
        borderWidth: 1,
        // elevation: 9999, // Very high elevation for Android
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        marginTop: 4,
        position: 'absolute', // Make dropdown items float above everything
        width: '100%',
        zIndex: 9999, // Very high zIndex
    },
    dropdownText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    placeholderStyle: {
        color: '#999',
        fontSize: 13,
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: '#666',
    },
    tickIcon: {
        width: 20,
        height: 20,
        tintColor: '#ff5252',
    },
    section: {
        marginBottom: 5,
    },
    labelWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 8,
    },
    halfWidth: {
        // marginHorizontal: 5,
    },
    dropdownSmall: {
        width: width * 0.4 - 30,
        backgroundColor: '#fff',
        borderColor: '#e1e5e9',
        borderWidth: 1,
        borderRadius: 8,
        minHeight: 40,
        paddingHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    shiftButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    shiftButton: {
        backgroundColor: gray[100],
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: gray[300],
        flex: 1,
        minWidth: '45%',
    },
    shiftButtonSelected: {
        backgroundColor: red[100],
        borderColor: red[500],
    },
    shiftButtonText: {
        fontSize: 12,
        color: gray[600],
        textAlign: 'center',
    },
    shiftButtonTextSelected: {
        color: red[700],
        fontWeight: 'bold',
    },
    attendanceButton: {
        backgroundColor: gray[100],
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: gray[300],
        flex: 1,
    },
    attendanceButtonSelected: {
        backgroundColor: red[100],
        borderColor: red[500],
    },
    attendanceButtonText: {
        fontSize: 14,
        color: gray[600],
        textAlign: 'center',
    },
    attendanceButtonTextSelected: {
        color: red[700],
        fontWeight: 'bold',
    },
    evaluationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    evaluationText: {
        fontSize: 14,
        color: gray[600],
        fontStyle: 'italic',
    },
    noteInput: {
        borderWidth: 1,
        borderColor: gray[300],
        borderRadius: 8,
        padding: 12,
        textAlignVertical: 'top',
        backgroundColor: '#fff',
        fontSize: 14,
    },
    footer: {
        borderTopColor: gray[300],
        borderTopWidth: 1,
        marginTop: 10,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
});