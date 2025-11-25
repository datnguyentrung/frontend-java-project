import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CoachAttendanceDetailScreen from '../CoachAttendanceFormScreen/CoachAttendanceDetailScreen';
import Dropdown from '@/components/common/Dropdown';
import { useBranches } from '@/hooks/useBranches';
import { useClassSessions } from '@/hooks/useClassSessions';
import type { CreateRequest } from '@/types/attendance/CoachAttendanceTypes';
import { navigateToFeature } from '@/navigation/FeatureNavigator';
import { useNavigation } from '@react-navigation/native';
import { getBytescaleAuthToken } from '@/services/upload/BytescaleUploadController';
import { createCoachAttendance } from '@/services/attendance/coachAttendanceService';
import { uploadFileWithAuth } from '@/utils/uploadToBytescale';
import { formatDateDMYHM, formatDateTimeForBackend } from '@/utils/format';
import dayjs from 'dayjs';

const shiftOptions = [
    { label: 'Ca 1', value: '1' },
    { label: 'Ca 2', value: '2' },
]

const periodOptions = [
    { label: 'Sáng', value: 'A' },
    { label: 'Tối', value: 'P' },
]

export default function CoachAttendanceFormScreen() {
    const [openBranch, setOpenBranch] = React.useState(false);
    const [selectedBranch, setSelectedBranch] = React.useState<number | null>(null);
    const [selectedShift, setSelectedShift] = React.useState<string>('1');
    const [selectedPeriod, setSelectedPeriod] = React.useState<string>('P');
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [fileName, setFileName] = React.useState<string | null>(null);
    const [idCoach, setIdCoach] = React.useState<string | null>(null);
    const [nameCoach, setCoachName] = React.useState<string | null>(null);

    // Sử dụng custom hooks thay vì duplicate logic
    const { branches: branchList, loading: branchesLoading } = useBranches();
    const { classSessions, loading: classSessionsLoading } = useClassSessions();

    const navigation = useNavigation();

    const activeValues = classSessions
        .filter(session => session.isActive)
        .map(session => session.value);

    React.useEffect(() => {
        if (!branchesLoading && branchList.length > 0 && selectedBranch === null) {
            setSelectedBranch(branchList[0].value);
        }
    }, [branchesLoading, branchList, selectedBranch]);

    // Xử lý khi chọn ảnh từ PhotoCaptureScreen
    const handleImageSelected = React.useCallback((fileName: string, fileUri: string) => {
        setFileName(fileName);
        setSelectedImage(fileUri);
        console.log('📷 Image selected:', fileName, fileUri);
    }, []);

    const handleArcFaceAI = React.useCallback((idCoach: string, nameCoach: string) => {
        setIdCoach(idCoach);
        setCoachName(nameCoach);
        console.log('🤖 ArcFace AI recognized coach:', idCoach, nameCoach);
    }, []);

    // Function để xóa thông tin HLV
    const handleClearCoach = React.useCallback(() => {
        setIdCoach(null);
        setCoachName(null);
        console.log('🗑️ Coach information cleared');
    }, []);

    const handleSubmit = async () => {
        console.log('idCoach: ', idCoach);
        // Validate ảnh đã được chọn
        if (!((selectedImage && fileName) || idCoach)) {
            Alert.alert('Lỗi', 'Vui lòng chụp hoặc quét ảnh minh chứng trước khi điểm danh.');
            return;
        }

        const weekDay = new Date().getDay() + 1; // 1 (Chủ nhật) đến 7 (Thứ bảy)
        const idClassSession = selectedPeriod + selectedBranch + weekDay + "C" + selectedShift;

        const requestData: CreateRequest = {
            idClassSession,
            createdAt: formatDateTimeForBackend(Date.now()),
            ...(fileName && { fileName }),   // chỉ thêm nếu fileName tồn tại
            ...(idCoach && { idAccount: idCoach }), // chỉ thêm nếu idCoach tồn tại
        };

        if (!activeValues.includes(idClassSession)) {
            Alert.alert('Lỗi', 'Buổi học này không hoạt động. Vui lòng kiểm tra lại lựa chọn của bạn.');
            console.log('Buổi học không hoạt động:', idClassSession);
            return;
        } else {
            // Upload ảnh lên server nếu có
            if (selectedImage && fileName) {
                try {
                    console.log('📤 Starting file upload...');

                    // Sử dụng hàm upload kết hợp (recommended)
                    const fileUrl = await uploadFileWithAuth(
                        selectedImage,        // fileUri
                        fileName,            // fileName  
                        'coach_attendance',  // folderName
                        'image/jpeg'         // mimeType (optional, will be detected if not provided)
                    );

                    console.log('✅ Image uploaded successfully:', fileUrl);
                } catch (error) {
                    console.error('❌ Image upload failed:', error);
                    Alert.alert('Lỗi', 'Upload ảnh thất bại. Vui lòng thử lại.');
                    return;
                }
            }

            try {
                await createCoachAttendance(requestData);
                handleClearCoach();
                Alert.alert('Thành công', `Điểm danh thành công !`);
                console.log('Điểm danh thành công cho buổi học:', requestData);

                navigateToFeature("Chấm công", navigation);
            } catch (error) {
                console.error('Error creating coach attendance:', error);
                Alert.alert('Lỗi', 'Không thể tạo điểm danh cho HLV. Vui lòng thử lại.');
            }
        }
    };

    // Hàm xử lý khi nhấn button
    const handleButtonPress = (buttonName: string) => {
        console.log('🚀 Feature pressed:', buttonName);

        if (buttonName === "Chụp ảnh") {
            // Navigate đến PhotoCaptureScreen với callback
            (navigation as any).navigate('PhotoCaptureScreen', {
                onImageSelected: handleImageSelected,
                returnScreen: 'CoachAttendanceFormScreen'
            });
            return;
        }

        if (buttonName === "ArcFace AI") {
            // Navigate đến ArcFaceAIScreen với callback
            console.log('🚀 Attempting to navigate to ArcFaceAIScreen...');
            try {
                (navigation as any).navigate('ArcFaceAIScreen', {
                    onHandleArcFaceAI: handleArcFaceAI,
                    returnScreen: 'CoachAttendanceFormScreen'
                });
                console.log('✅ Navigation to ArcFaceAIScreen successful');
            } catch (error) {
                console.error('❌ Navigation to ArcFaceAIScreen failed:', error);
                Alert.alert('Lỗi', 'Không thể mở ArcFace AI. Vui lòng thử lại.');
            }
            return;
        }

        // Sử dụng navigation helper từ FeatureNavigator cho các screen khác
        const success = navigateToFeature(buttonName, navigation);

        if (!success) {
            // Fallback alert nếu không tìm thấy screen
            Alert.alert(
                'Thông báo',
                `Tính năng "${buttonName}" đang được phát triển`,
                [{ text: 'OK', style: 'default' }]
            );
        }
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {/* Thời gian điểm danh */}
            <View style={styles.timeCard}>
                <Text style={styles.timeLabel}>Thời gian điểm danh</Text>
                <Text style={styles.timeValue}>{formatDateDMYHM(Date.now())}</Text>
            </View>

            {/* Chọn cơ sở */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                    Cơ sở <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.dropdownWrapper}>
                    <Dropdown
                        open={openBranch}
                        setOpen={setOpenBranch}
                        selected={selectedBranch}
                        setSelected={(value) => setSelectedBranch(value)}
                        list={branchList}
                        placeholder='Chọn cơ sở'
                        dropDownDirection="BOTTOM"
                    />
                </View>
            </View>

            {/* Ca dạy */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                    Ca dạy <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.radioRow}>
                    {shiftOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={styles.radioItemContainer}
                            onPress={() => setSelectedShift(option.value)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.radioButton,
                                selectedShift === option.value && styles.radioButtonSelected
                            ]}>
                                {selectedShift === option.value && (
                                    <View style={styles.radioButtonInner} />
                                )}
                            </View>
                            <Text style={[
                                styles.radioText,
                                selectedShift === option.value && styles.radioTextSelected
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Buổi học */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                    Buổi học <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.radioRow}>
                    {periodOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={styles.radioItemContainer}
                            onPress={() => setSelectedPeriod(option.value)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.radioButton,
                                selectedPeriod === option.value && styles.radioButtonSelected
                            ]}>
                                {selectedPeriod === option.value && (
                                    <View style={styles.radioButtonInner} />
                                )}
                            </View>
                            <Text style={[
                                styles.radioText,
                                selectedPeriod === option.value && styles.radioTextSelected
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>



            {idCoach && nameCoach ? (
                <CoachAttendanceDetailScreen
                    idCoach={idCoach}
                    nameCoach={nameCoach}
                    onClearCoach={handleClearCoach}
                    handleButtonPress={handleButtonPress}
                />
            ) : (
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                        Ảnh minh chứng <Text style={styles.required}>*</Text>
                    </Text>

                    {selectedImage ? (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                                <TouchableOpacity
                                    style={styles.changeImageButton}
                                    onPress={() =>
                                        // handleButtonPress("Chụp ảnh")
                                        handleButtonPress("ArcFace AI")
                                    }
                                    activeOpacity={0.7}
                                >
                                    <MaterialIcons name="edit" size={24} color="#DC2626" />
                                    <Text style={styles.changeImageText}>Đổi ảnh</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.changeImageButton}
                                    onPress={() => setSelectedImage(null)}
                                    activeOpacity={0.7}
                                >
                                    <MaterialIcons name="delete" size={24} color="#DC2626" />
                                    <Text style={styles.changeImageText}>Xóa ảnh</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.uploadOptionsContainer}>
                            <TouchableOpacity
                                style={styles.uploadOptionButton}
                                activeOpacity={0.7}
                                onPress={() => handleButtonPress("Chụp ảnh")}
                            >
                                <MaterialIcons name="add-photo-alternate" size={32} color="#DC2626" />
                                <Text style={styles.uploadOptionText}>Chụp ảnh</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.uploadOptionButton}
                                activeOpacity={0.7}
                                onPress={() => handleButtonPress("ArcFace AI")}
                            >
                                <MaterialIcons name="face-retouching-natural" size={32} color="#DC2626" />
                                <Text style={styles.uploadOptionText}>ArcFace AI</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )
            }

            {/* Nút điểm danh */}
            <LinearGradient
                colors={['#DC2626', '#B91C1C']} // from-red-600 to-red-700
                style={styles.submitButton}
            >
                <TouchableOpacity
                    style={styles.submitButtonInner}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                >
                    <Text style={styles.submitText}>Điểm danh ngay 📝</Text>
                </TouchableOpacity>
            </LinearGradient>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 16,
    },
    timeCard: {
        backgroundColor: '#FEF2F2', // bg-red-50
        borderLeftWidth: 4,
        borderLeftColor: '#DC2626', // border-red-600
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    timeLabel: {
        fontSize: 14,
        color: '#B91C1C', // text-red-700
        marginBottom: 4,
    },
    timeValue: {
        fontSize: 16,
        color: '#7F1D1D', // text-red-900
        fontWeight: '500',
    },
    inputGroup: {
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 16,
        color: '#374151', // text-gray-700
        marginBottom: 8,
        fontWeight: '500',
    },
    required: {
        color: '#DC2626', // text-red-600
    },
    dropdownWrapper: {
        marginTop: 4,
    },
    radioRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
        // paddingVertical: 8,
    },
    radioItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flex: 1,
        justifyContent: 'center',
        borderRadius: 8,
        marginHorizontal: 4,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#F87171', // border-red-400
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        backgroundColor: '#FFFFFF',
    },
    radioButtonSelected: {
        borderColor: '#DC2626', // border-red-600
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#DC2626', // text-red-600
    },
    radioText: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
        textAlign: 'center',
        flex: 1,
    },
    radioTextSelected: {
        color: '#DC2626',
        fontWeight: '600',
    },
    uploadButton: {
        backgroundColor: '#FEF2F2', // bg-red-50
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FECACA', // border-red-300
        borderStyle: 'dashed',
    },
    uploadText: {
        fontSize: 16,
        color: '#B91C1C', // text-red-700
        fontWeight: '500',
        marginTop: 8,
    },
    uploadOptionsContainer: {
        backgroundColor: '#FEF2F2', // bg-red-50
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: '#FECACA', // border-red-300
        borderStyle: 'dashed',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    uploadOptionButton: {
        backgroundColor: '#FEE2E2', // bg-red-100
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: '#FECACA', // border-red-300
    },
    uploadOptionText: {
        fontSize: 14,
        color: '#B91C1C', // text-red-700
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
    imageContainer: {
        backgroundColor: '#FEF2F2', // bg-red-50
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FECACA', // border-red-300
    },
    selectedImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    changeImageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FEE2E2', // bg-red-100
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FECACA', // border-red-300
    },
    changeImageText: {
        fontSize: 14,
        color: '#B91C1C', // text-red-700
        fontWeight: '500',
        marginLeft: 6,
    },
    submitButton: {
        borderRadius: 12,
        marginTop: 24,
        elevation: 6,
        shadowColor: '#DC2626',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    submitButtonInner: {
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});