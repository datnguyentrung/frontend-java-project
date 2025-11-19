import React from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import CoachAttendanceHeaderScreen from './CoachAttendanceHeaderScreen';
import CoachAttendanceItemScreen from './CoachAttendanceItemScreen';
import { CoachAttendanceRes } from '@/types/attendance/CoachAttendanceTypes';
import { getCoachAttendanceByYearAndMonth } from '@/services/attendance/coachAttendanceService';
import { useAuth } from '@/providers/AuthProvider';
import { gray } from '@/styles/colorTypes';

export default function CoachAttendanceScreen() {
    const { userInfo } = useAuth();

    const [attendanceData, setAttendanceData] = React.useState<CoachAttendanceRes[]>([]); // Dữ liệu chấm công
    const [refreshing, setRefreshing] = React.useState(false); // State cho pull to refresh

    const [selectedDate, setSelectedDate] = React.useState(new Date());

    // Hàm lấy dữ liệu chấm công
    const fetchAttendanceData = async () => {
        if (!userInfo || !userInfo?.idAccount) return;
        try {
            const data = await getCoachAttendanceByYearAndMonth(
                userInfo.idAccount!,
                selectedDate.getFullYear(),
                selectedDate.getMonth() + 1
            );
            setAttendanceData(data);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        }
    };

    // Hàm xử lý pull to refresh
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchAttendanceData();
        setRefreshing(false);
    }, [userInfo, selectedDate]);

    React.useEffect(() => {
        fetchAttendanceData();
    }, [selectedDate]); // Thêm selectedDate vào dependency để load lại khi đổi tháng

    return (
        <View style={styles.container}>
            <CoachAttendanceHeaderScreen
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                count={attendanceData.length}
            />
            <FlatList
                data={[...attendanceData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} // Sắp xếp giảm dần theo ngày
                renderItem={({ item }) => <CoachAttendanceItemScreen attendance={item} />}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#ff0000']} // Màu của loading indicator (Android)
                        tintColor="#ff0000" // Màu của loading indicator (iOS)
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 16,
        backgroundColor: gray[50],
    },
});