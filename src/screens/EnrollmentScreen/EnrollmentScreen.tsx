import React from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import { RegistrationDTO } from '@/types/RegistrationTypes';
import { Attendance } from '@/types/AttendanceTypes';
import { gray } from '@styles/colorTypes';

import EnrollmentHeaderScreen from './EnrollmentHeaderScreen';
import EnrollmentItemScreen from './EnrollmentItemScreen';
import EnrollmentModalClassSessionScreen from './EnrollmentModalClassSessionScreen';

import { getTodayTrialAttendance } from '@/services/attendance/trialAttendanceService';
import { getAllRegistration } from '@/services/training/registrationService';

export default function EnrollmentScreen() {
    const [data, setData] = React.useState<RegistrationDTO[]>([]);
    const [searchText, setSearchText] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<RegistrationDTO | null>(null);
    const [attendanceData, setAttendanceData] = React.useState<Attendance[]>([]); // State để lưu dữ liệu điểm danh

    const [refreshing, setRefreshing] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true; // tránh setState khi component đã unmount

        const loadTrialAttendanceData = async () => {
            try {
                const today = new Date();

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
        enrollCount: data.filter(item => item.registrationInfo.registrationStatus === 'ENROLL').length,
        trialCount: data.filter(item => item.registrationInfo.registrationStatus === 'TRIAL').length,
        registerCount: data.filter(item => item.registrationInfo.registrationStatus === 'REGISTERED').length,
    }), [data]);

    // console.log('filteredData:', filteredData);

    // console.log('attendanceData:', attendanceData);

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredData}
                renderItem={({ item }) => (
                    <EnrollmentItemScreen
                        item={item}
                        setVisible={setVisible}
                        setSelectedItem={setSelectedItem}
                        isAttendance={attendanceData.some(att => att.idStudent === item.idRegistration)}
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
            {/* <View> */}
            <Modal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={() => setVisible(false)}
                style={{ flex: 1 }}  // Ensure modal takes full height
                statusBarTranslucent
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
    }
});