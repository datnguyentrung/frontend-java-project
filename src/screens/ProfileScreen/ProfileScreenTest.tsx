import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@providers/AuthProvider';
import { UserInfo } from '@/types/types';
/**
 * ProfileScreen - Màn hình hồ sơ cá nhân
 * Hiển thị thông tin về người dùng và chức năng đăng xuất
 */
export default function ProfileScreenTest() {
    const { signOut, user } = useAuth();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        // Lấy user info trực tiếp từ user context
        if (user?.info) {
            setUserInfo(user.info);
        }
    }, [user]);

    const handleFetchUserInfo = async () => {
        Alert.alert("User Info from State", JSON.stringify(userInfo, null, 2));
        Alert.alert("User Info from Auth", JSON.stringify(user, null, 2));
    };

    const handleSignOut = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất không?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Đăng xuất',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={80} color="#FF5252" />
                </View>
                <Text style={styles.title}>👤 Hồ sơ cá nhân</Text>
                <Text style={styles.subtitle}>Thông tin về bạn</Text>
            </View>

            <View style={styles.infoSection}>
                <View style={styles.infoContainer}>
                    <Ionicons name="person-outline" size={20} color="#FF5252" />
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Họ và tên: </Text>
                        <Text style={styles.infoValue}>{user?.info?.name || 'Người dùng mới'}</Text>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <Ionicons name="mail-outline" size={20} color="#FF5252" />
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Quyền hạn:</Text>
                        <Text style={styles.infoValue}>{user?.info?.role || 'Người dùng mới'}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionSection}>
                <TouchableOpacity style={styles.fetchButton} onPress={handleFetchUserInfo}>
                    <Ionicons name="information-circle-outline" size={20} color="#FFF" />
                    <Text style={styles.fetchButtonText}>Fetch User Info</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={20} color="#FFF" />
                    <Text style={styles.signOutButtonText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.description}>
                Màn hình này hiển thị thông tin chi tiết về người dùng và cung cấp các chức năng quản lý tài khoản
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        paddingTop: 20,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF5252',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    infoSection: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    infoTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    actionSection: {
        gap: 12,
    },
    fetchButton: {
        backgroundColor: '#FF5252',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF5252',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    fetchButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    signOutButton: {
        backgroundColor: '#D32F2F',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#D32F2F',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    signOutButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    description: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 20,
        paddingHorizontal: 20,
    },
});