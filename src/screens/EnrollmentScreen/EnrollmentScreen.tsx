import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Text } from 'react-native';
import { RegistrationDTO } from '@/types/RegistrationTypes';
import { gray } from '@styles/colorTypes';

import EnrollmentHeaderScreen from './EnrollmentHeaderScreen';
import EnrollmentItemScreen from './EnrollmentItemScreen';
import EnrollmentModalClassSessionScreen from './EnrollmentModalClassSessionScreen';
import EnrollmentFormScreen from './EnrollmentFormScreen';

import { getTodayTrialAttendance } from '@/services/attendance/trialAttendanceService';
import { getAllRegistration } from '@/services/registrationService';

import Modal from 'react-native-modal';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TrialAttendanceDetail } from '@/types/attendance/TrialAttendanceTypes';

const { width } = Dimensions.get('window');

export default function EnrollmentScreen() {
    const [data, setData] = React.useState<RegistrationDTO[]>([]);
    const [searchText, setSearchText] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [visibleForm, setVisibleForm] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<RegistrationDTO | null>(null);
    const [attendanceData, setAttendanceData] = React.useState<TrialAttendanceDetail[]>([]); // State để lưu dữ liệu điểm danh

    const [refreshing, setRefreshing] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true; // tránh setState khi component đã unmount

        const loadTrialAttendanceData = async () => {
            try {
                // Gọi song song cả 2 API
                const [attendanceRecords, registrations] = await Promise.all([
                    getTodayTrialAttendance(),
                    getAllRegistration()
                ]);

                if (isMounted) {
                    setAttendanceData(attendanceRecords);
                    setData(registrations);
                }
            } catch (error) {
                console.error("Failed to load trial attendance data:", error);
            } finally {
                // Dù thành công hay lỗi cũng reset refreshing
                if (isMounted) setRefreshing(false);
            }
        };

        // chỉ chạy khi refreshing = true hoặc lần đầu
        if (refreshing) {
            loadTrialAttendanceData();
        }

        return () => {
            isMounted = false;
        };
    }, [refreshing]);

    // hàm gọi khi user kéo để refresh
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
    }, []);

    // Memoize filtered data để tránh re-calculate mỗi lần render
    const filteredData = React.useMemo(() => {
        if (!searchText.trim()) return data;

        console.log("Filtering data with search text:", searchText);
        return data.filter(item =>
            item.personalInfo.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.idRegistration.toLowerCase().includes(searchText.toLowerCase()) ||
            item.personalInfo.phone.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [data, searchText]);

    // Memoize counts để tránh re-calculate
    const counts = React.useMemo(() => ({
        enrollCount: data.filter(item => item.registrationInfo.registrationStatus === 'ENROLLED').length,
        trialCount: data.filter(item => item.registrationInfo.registrationStatus === 'TRIAL').length,
        registerCount: data.filter(item => item.registrationInfo.registrationStatus === 'REGISTERED').length,
    }), [data]);

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredData}
                renderItem={({ item }) => (
                    <EnrollmentItemScreen
                        item={item}
                        setVisible={setVisible}
                        setSelectedItem={setSelectedItem}
                        isAttendance={attendanceData.some(att => att.idAccount === item.idRegistration)}
                        setVisibleForm={setVisibleForm}
                    />
                )}
                ListHeaderComponent={<EnrollmentHeaderScreen
                    enrollCount={counts.enrollCount}
                    trialCount={counts.trialCount}
                    registerCount={counts.registerCount}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.listContent}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />

            <TouchableOpacity
                style={styles.addRegistrationButton}
                onPress={() => setVisibleForm(true)}
            >
                <AntDesign name="plus" size={30} color="white" />
            </TouchableOpacity>

            <Modal
                isVisible={visibleForm}               // kiểm soát hiển thị modal
                animationIn="fadeIn"               // hiệu ứng hiện modal
                animationOut="fadeOut"           // hiệu ứng ẩn modal
                animationInTiming={100}               // thời gian animation hiện
                animationOutTiming={100}              // thời gian animation ẩn
                backdropTransitionInTiming={100}      // thời gian fade của nền khi hiện
                backdropTransitionOutTiming={100}     // thời gian fade của nền khi ẩn
                backdropOpacity={0.5}                 // độ mờ của nền
                onBackdropPress={() => setVisibleForm(false)} // ✅ Sửa lỗi: dùng setVisibleForm
                onSwipeComplete={() => setVisibleForm(false)} // ✅ Sửa lỗi: dùng setVisibleForm
                // swipeDirection="down"                 // hướng swipe để đóng
                useNativeDriver                        // dùng native driver cho animation mượt
                useNativeDriverForBackdrop
                statusBarTranslucent
                coverScreen
                style={styles.modalStyle}             // style cho modal
            >
                <EnrollmentFormScreen
                    setVisibleForm={setVisibleForm}
                    setRefreshing={setRefreshing}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                />
            </Modal>

            <Modal
                isVisible={visible}               // kiểm soát hiển thị modal
                animationIn="fadeIn"               // hiệu ứng hiện modal
                animationOut="fadeOut"           // hiệu ứng ẩn modal
                animationInTiming={100}               // thời gian animation hiện
                animationOutTiming={100}              // thời gian animation ẩn
                backdropTransitionInTiming={100}      // thời gian fade của nền khi hiện
                backdropTransitionOutTiming={100}     // thời gian fade của nền khi ẩn
                backdropOpacity={0.5}                 // độ mờ của nền
                onBackdropPress={() => setVisible(false)} // tắt modal khi nhấn nền
                onSwipeComplete={() => setVisible(false)} // tắt modal khi swipe xuống
                // swipeDirection="down"                 // hướng swipe để đóng
                useNativeDriver                        // dùng native driver cho animation mượt
                useNativeDriverForBackdrop
                statusBarTranslucent
                coverScreen
                style={styles.modalStyle}             // style cho modal
            >
                <EnrollmentModalClassSessionScreen
                    setVisible={setVisible}
                    selectedItem={selectedItem}
                    setRefreshing={setRefreshing}
                />
            </Modal>
            {/* </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: gray[100],
    },
    listContent: {
        flexGrow: 1,
    },
    addRegistrationButton: {
        width: width * 0.15,
        height: width * 0.15,
        borderRadius: (width * 0.15) / 2,
        backgroundColor: '#ff5252',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 40,
        right: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
    },
    modalStyle: {
        justifyContent: 'center',  // modal xuất hiện từ dưới lên
        alignItems: 'center',
        overflow: 'hidden',
        margin: 0,                   // modal full width
        padding: 20,
    },
});