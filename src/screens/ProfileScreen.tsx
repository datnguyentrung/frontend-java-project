import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * ProfileScreen - Màn hình hồ sơ cá nhân
 * Hiển thị thông tin về người dùng
 */
const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>👤 Hồ sơ cá nhân</Text>
            <Text style={styles.subtitle}>Thông tin về bạn</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Tên:</Text>
                <Text style={styles.infoValue}>Người dùng mới</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>user@example.com</Text>
            </View>
            <Text style={styles.description}>
                Màn hình này sẽ hiển thị thông tin chi tiết về người dùng
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Màu nền trắng xám
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007bff', // Màu xanh dương
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    infoContainer: {
        flexDirection: 'row', // Xếp theo chiều ngang
        marginBottom: 15,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        width: 80, // Đặt width cố định để căn chỉnh
    },
    infoValue: {
        fontSize: 16,
        color: '#666',
        marginLeft: 10,
    },
    description: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 30,
        lineHeight: 20,
    },
});

export default ProfileScreen;
