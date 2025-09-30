import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { UserInfo } from '@/types/types';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileFooterScreen() {
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
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

});