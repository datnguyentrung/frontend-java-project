import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { red, green, blue } from '@styles/colorTypes'
import { beltLevelStyles } from '@/styles/beltLevel';
import taekwondo from '@assets/taekwondo.jpg';
import { UserResponse } from "@/types/Auth/UsersTypes";
import { BeltLevel } from '@/types/types';

const { width, height } = Dimensions.get('window');
const imageSize = width * 0.25;

type Props = {
    currentUser: UserResponse | null;
};

const roles = [
    { key: 'STUDENT', label: 'Học Viên' },
    { key: 'COACH', label: 'Huấn Luyện Viên' },
    { key: 'ADMIN', label: 'Quản Trị Viên' },
]

export default function ProfileHeaderScreen({ currentUser }: Props) {
    // Tính toán belt data ngay lập tức thay vì dùng state
    const getBeltData = React.useCallback((): BeltLevel => {
        if (currentUser?.userProfile?.beltLevel) {
            const beltKey = currentUser.userProfile.beltLevel;
            return {
                label: beltLevelStyles[beltKey].label,
                backgroundColor: beltLevelStyles[beltKey].backgroundColor,
                color: beltLevelStyles[beltKey].color,
            };
        }
        // Fallback values
        return {
            label: 'Trắng',
            backgroundColor: '#ffffff',
            color: '#000000'
        };
    }, [currentUser]);

    const beltData = getBeltData();

    // // Debug logging
    // React.useEffect(() => {
    //     console.log('ProfileHeaderScreen - Belt Data:', beltData);
    //     console.log('ProfileHeaderScreen - Current User Belt Level:', currentUser?.userProfile?.beltLevel);
    // }, [beltData, currentUser]);

    // console.log('Current User in ProfileHeaderScreen:', currentUser);

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Image source={taekwondo} style={styles.avatar} />
                <View style={[styles.isActive, {
                    backgroundColor: currentUser?.userProfile.isActive ? green[500] : red[500]
                }]} />
            </View>

            <Text style={styles.name}>{currentUser?.userProfile.name}</Text>

            <View
                key={`belt-${currentUser?.userProfile?.beltLevel || 'default'}`}
                style={[styles.beltContainer, { backgroundColor: beltData.backgroundColor }]}
            >
                <View
                    key={`indicator-${currentUser?.userProfile?.beltLevel || 'default'}`}
                    style={[styles.beltIndicator, { backgroundColor: beltData.color }]}
                />
                <Text style={[styles.beltText, { color: beltData.color }]}>Đai {beltData.label}</Text>
            </View>

            <View style={styles.roleContainer}>
                <Text style={styles.roleText}>{roles.find(role => role.key === currentUser?.userInfo.idRole)?.label}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: red[500],
        alignItems: 'center',
        paddingBottom: 40,
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: height * 0.05,
    },
    avatar: {
        width: imageSize,
        height: imageSize,
        borderRadius: imageSize / 2,
        borderWidth: 5,
        borderColor: '#00c8ffff',
    },
    name: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 400,
    },
    beltContainer: {
        marginVertical: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        overflow: 'hidden', // Đảm bảo borderRadius hoạt động
    },
    isActive: {
        width: 26,
        height: 26,
        borderRadius: 13,
        top: -22,
        right: -imageSize / 2 + 10,
        borderWidth: 2,
        borderColor: '#fff',
    },
    beltIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5, // borderRadius = width/2 để tạo hình tròn hoàn hảo
        overflow: 'hidden', // Đảm bảo borderRadius hoạt động
    },
    beltText: {
        fontSize: 13,
        fontWeight: '600',
    },
    roleContainer: {
        backgroundColor: blue[50],
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    roleText: {
        fontSize: 14,
        fontWeight: '500',
        color: blue[800],
    }
});