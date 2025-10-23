import { View, StyleSheet } from 'react-native';
import HeaderTitle from '@/components/layout/HeaderApp/HeaderTitle';
import HeaderBackground from '@/components/layout/HeaderApp/HeaderBackground';
import Constants from 'expo-constants';

export default function ScanHeaderScreen() {
    return (
        <View style={styles.container}>
            <HeaderBackground route='Scan' />
            <View style={styles.titleContainer}>
                <View style={styles.bottomRow}>
                    <View style={styles.titleWrapper}>
                        <HeaderTitle>Điểm danh</HeaderTitle>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 130, // Thêm height cố định để header hiển thị
        overflow: 'hidden',
        position: 'relative',
    },
    titleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: Constants.statusBarHeight, // Tạo khoảng cách từ status bar
        paddingBottom: 10, // Thêm padding bottom để không sát đáy
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 15, // Padding hai bên
    },
    titleWrapper: {
        flex: 1,
        alignItems: 'center', // Căn giữa title
        // justifyContent: 'flex-end'
    },
    iconLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: 15, // Sát bên phải
        paddingVertical: 10,
        paddingHorizontal: 18,
        bottom: 3,
        borderRadius: 20,
    },
});