import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScheduleScreen() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ffffff', '#ffe5e5', '#ff0000']} // trắng -> hồng nhạt -> đỏ
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View style={styles.header}>
                    <View style={styles.dateTimeContainer}>
                        <Text style={styles.timeText}>17:30 - 19:00</Text>
                        <View style={styles.dateSection}>
                            <Text style={styles.dateIcon}>📅</Text>
                            <Text style={styles.dateText}>29/08/2025</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.content}>
                    <View style={styles.titleSection}>
                        <Text style={styles.classIcon}>🥋</Text>
                        <View style={styles.classInfo}>
                            <Text style={styles.title}>Cơ sở cơ bản</Text>
                            <Text style={styles.subtitle}>Nội dung buổi tập</Text>
                        </View>
                    </View>

                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Sắp diễn ra</Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        width: '100%',
        justifyContent: 'center',
        // marginTop: 7,
        // marginBottom: 5,
        paddingHorizontal: 16,
        paddingVertical: 5
    },
    card: {
        borderRadius: 16,
        paddingVertical: 5,
        paddingHorizontal: 16,
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    header: {
        marginBottom: 12,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 16,
        color: '#333333',
    },
    dateSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    dateIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffffff',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        // marginVertical: 3,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: 5,
    },
    titleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    classIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    classInfo: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000ff',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 14,
        color: '#333333',
        // fontWeight: '500',
    },
    statusBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
