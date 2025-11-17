import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { AntDesign, Feather } from '@expo/vector-icons';
import { green, yellow, red, gray } from '@styles/colorTypes';
import taekwondo from '@assets/taekwondo.jpg';
import { formatTimeStringHM } from '@utils/format';
import { markEvaluation } from '@/services/attendance/trialAttendanceService';
import { useMutation } from "@tanstack/react-query";
import { TrialAttendanceDetail } from '@/types/attendance/TrialAttendanceTypes';

const { width } = Dimensions.get('window');

const evaluationCategories = [
    { label: 'Tốt', key: 'T', backGroundColor: green[50], textColor: green[700] },
    { label: 'Trung bình', key: 'TB', backGroundColor: yellow[50], textColor: yellow[700] },
    { label: 'Yếu', key: 'Y', backGroundColor: red[50], textColor: red[700] },
];

type Props = {
    item: TrialAttendanceDetail;
    index: number;
    onEvaluationChange?: (index: number, value: string) => void;
    refreshTrialAttendance?: () => void;
};

export default function TrialAttendanceItemScreen({ item, index, onEvaluationChange, refreshTrialAttendance }: Props) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [localEvaluationStatus, setLocalEvaluationStatus] = React.useState<string | null>(null);

    // Sử dụng localEvaluationStatus (optimistic update) nếu có, nếu không thì dùng giá trị gốc
    const currentValue = localEvaluationStatus ?? item.evaluation.evaluationStatus ?? '';

    // Reset local state when attendanceRecord changes
    React.useEffect(() => {
        setLocalEvaluationStatus(null);
    }, [item]);

    const mutationMarkEvaluation = useMutation({
        mutationFn: async (newStatus: string) => {
            if (!item) return;
            await markEvaluation({
                attendanceKey: {
                    idRegistration: item.idAccount,
                    idClassSession: item.idClassSession,
                    attendanceDate: item.attendanceDate, // Ensure this is a Date object
                },
                evaluationStatus: newStatus,
            });
        },
        onMutate: async (variables) => {
            const previousValue = localEvaluationStatus ?? item.evaluation.evaluationStatus ?? '';
            setLocalEvaluationStatus(variables);
            return { previousValue };
        },
        onSuccess: () => {
            console.log("Evaluation marked successfully");
            // Gọi refresh để lấy lại data mới từ server
            if (refreshTrialAttendance) {
                refreshTrialAttendance();
            }
        },
        onError: (error, variables, context) => {
            if (context?.previousValue !== undefined) {
                setLocalEvaluationStatus(context.previousValue || null);
            } else {
                setLocalEvaluationStatus(null);
            }
            console.error("Error marking evaluation:", error);
        }
    });

    const handleValueChange = (value: string | null) => {
        const newValue = value || '';

        // Trigger mutation để cập nhật server
        mutationMarkEvaluation.mutate(newValue);

        // Cập nhật parent component nếu có callback
        if (onEvaluationChange) {
            onEvaluationChange(index, newValue);
        }
    };

    return (
        <View style={styles.itemContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={taekwondo} style={styles.image} />
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 5 }}>
                        {item.registrationDTO.personalInfo.name}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, gap: 5 }}>
                            <Feather name="map-pin" size={12} color="#ccc" />
                            <Text style={{ color: '#666', fontSize: 12 }}>Cơ sở {item.idClassSession[2]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Feather name="calendar" size={12} color="#ccc" />
                            <Text style={{ color: '#666', fontSize: 12 }}>
                                {item.attendance.attendanceTime
                                    ? formatTimeStringHM(item.attendance.attendanceTime)
                                    : "Chưa có giờ"}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.evaluationContainer}>
                {/* Star icon hiển thị status hiện tại */}
                <AntDesign
                    name="star"
                    size={16}
                    color={
                        currentValue === 'T' ? green[600]
                            : currentValue === 'TB' ? yellow[600]
                                : currentValue === 'Y' ? red[600]
                                    : gray[400]
                    }
                    style={{ marginRight: 5 }}
                />

                {/* Dropdown để thay đổi */}
                <DropDownPicker
                    open={isOpen}
                    setOpen={setIsOpen}
                    value={currentValue}
                    setValue={(callback) => {
                        const newValue = typeof callback === 'function' ? callback(currentValue) : callback;
                        handleValueChange(newValue);
                    }}
                    items={evaluationCategories.map(eva => ({
                        label: eva.label,
                        value: eva.key,
                        labelStyle: { color: eva.textColor }
                    }))}
                    style={[
                        styles.dropdownEvaluation,
                        {
                            backgroundColor: currentValue === 'T' ? green[50]
                                : currentValue === 'TB' ? yellow[50]
                                    : currentValue === 'Y' ? red[50]
                                        : '#fff',
                            // Thêm opacity khi đang loading
                            opacity: mutationMarkEvaluation.isPending ? 0.7 : 1
                        }
                    ]}
                    dropDownContainerStyle={[
                        styles.dropdownContainer,
                        { zIndex: 9999 - index }
                    ]}
                    textStyle={[
                        styles.dropdownText,
                        {
                            color: currentValue === 'T' ? green[700]
                                : currentValue === 'TB' ? yellow[700]
                                    : currentValue === 'Y' ? red[700]
                                        : '#333'
                        }
                    ]}
                    placeholder="Đánh giá"
                    placeholderStyle={styles.placeholderStyle}
                    arrowIconStyle={styles.arrowIcon}
                    tickIconStyle={styles.tickIcon}
                    listMode="SCROLLVIEW"
                    zIndex={9999 - index}
                    zIndexInverse={1000 + index}
                    disabled={mutationMarkEvaluation.isPending} // Disable khi đang loading
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderColor: gray[200],
        borderWidth: 0.5,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 12,
        justifyContent: 'space-between', // Giữ space-between
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    evaluationStatus: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        padding: 5,
    },
    evaluationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', // ✅ Đẩy nội dung sát phải
        flex: 1, // ✅ Chiếm toàn bộ không gian còn lại
        maxWidth: width * 0.25, // ✅ Giới hạn width tối đa
    },
    dropdownEvaluation: {
        flex: 1, // ✅ Thay đổi từ width: '30%' thành flex: 1
        maxWidth: width * 0.25, // ✅ Giới hạn width tối đa
        backgroundColor: '#fff',
        borderColor: '#e1e5e9',
        borderWidth: 1,
        borderRadius: 12,
        minHeight: 40, // ✅ Giảm height để gọn hơn
        // elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        paddingHorizontal: 5,
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
        fontSize: 10,
        color: '#333',
        fontWeight: '500',
        // textAlign: 'center',
    },
    placeholderStyle: {
        color: '#999',
        fontSize: 9,
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
});