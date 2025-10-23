import { View, Text, StyleSheet } from 'react-native';
import ScanHeaderScreen from './ScanHeaderScreen';
import { useAuth } from '@/providers/AuthProvider';
import CoachAttendanceFormScreen from "../CoachAttendanceScreen/CoachAttendanceFormScreen/CoachAttendanceFormScreen";

export default function ScanScreen() {
    const { userInfo } = useAuth();

    return (
        <View style={styles.container}>
            <ScanHeaderScreen />
            {userInfo?.role === 'COACH' ?
                <CoachAttendanceFormScreen />
                : (<View style={styles.content}>
                    <Text style={styles.text}>Screen dành cho học viên để quét mã QR điểm danh.</Text>
                </View>
                )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: '#333',
    },
});