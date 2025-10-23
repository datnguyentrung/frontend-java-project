import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface CoachAttendanceDetailScreenProps {
    idCoach: string | null;
    nameCoach: string | null;
    onClearCoach: () => void;
    handleButtonPress: (buttonName: string) => void;
}

export default function CoachAttendanceDetailScreen({
    idCoach,
    nameCoach,
    onClearCoach,
    handleButtonPress
}: CoachAttendanceDetailScreenProps) {

    const handleClearCoach = () => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa thông tin HLV đã nhận diện?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: onClearCoach
                }
            ]
        );
    };

    const handleChangeCoach = () => {
        Alert.alert(
            'Chuyển HLV',
            'Bạn có chắc chắn muốn chuyển sang nhận diện HLV khác?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xác nhận',
                    style: 'destructive',
                    onPress: () => handleButtonPress('ArcFace AI')
                }
            ]
        );
    }

    if (!idCoach || !nameCoach) {
        return null;
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#16A34A', '#15803D']} // Green gradient
                style={styles.coachCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.successIcon}>
                        <MaterialIcons name="face-retouching-natural" size={32} color="#fff" />
                    </View>
                    <Text style={styles.headerText}>HLV Đã Nhận Diện</Text>
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearCoach}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close-circle" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="person" size={20} color="#fff" />
                        <Text style={styles.infoLabel}>Tên HLV:</Text>
                        <Text style={styles.infoValue}>{nameCoach}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="badge" size={20} color="#fff" />
                        <Text style={styles.infoLabel}>ID:</Text>
                        <Text style={styles.infoValue}>{idCoach}</Text>
                    </View>

                    <View style={styles.statusRow}>
                        <MaterialIcons name="verified" size={16} color="#fff" />
                        <Text style={styles.statusText}>Đã xác thực bởi AI</Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleChangeCoach}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="refresh" size={18} color="#16A34A" />
                        <Text style={styles.actionButtonText}>Nhận diện lại</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    coachCard: {
        borderRadius: 16,
        padding: 20,
        elevation: 8,
        shadowColor: '#16A34A',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'space-between',
    },
    successIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginHorizontal: 12,
    },
    clearButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardBody: {
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
        minWidth: 80,
    },
    infoValue: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 6,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
        paddingTop: 16,
        alignItems: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#16A34A',
        marginLeft: 8,
    },
});
