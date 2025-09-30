import React from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';

import ProfileHeaderScreen from './ProfileHeaderScreen';
import ProfileOptionScreen from './ProfileOptionScreen';
import ProfileFooterScreen from './ProfileFooterScreen';

import { getCurrentUser } from '@/services/auth/usersService';

import { UserResponse } from "@/types/Auth/UsersTypes";
import { blue, gray, green, pink, red, yellow } from '@/styles/colorTypes';

interface Option {
    icon: string;
    label: string;
    description: string;
    backgroundColor: string;
    color: string;
}

const OptionData: Option[] = [
    { icon: 'edit', label: 'Chỉnh sửa thông tin', description: 'Cập nhật thông tin cá nhân', backgroundColor: blue[50], color: blue[500] },
    { icon: 'lock', label: 'Đổi mật khẩu', description: 'Thay đổi mật khẩu đăng nhập', backgroundColor: green[50], color: green[500] },
    { icon: 'award', label: 'Thành tích & Lịch sử', description: 'Xem thành tích và lịch sử tham gia', backgroundColor: yellow[50], color: yellow[500] },
    { icon: 'users', label: 'Trợ giúp & Hỗ trợ', description: 'Nhận trợ giúp và hỗ trợ', backgroundColor: pink[50], color: pink[500] },
    { icon: 'settings', label: 'Cài đặt', description: 'Tùy chỉnh ứng dụng', backgroundColor: gray[50], color: gray[500] },
]

export default function ProfileScreen() {
    const [currentUser, setCurrentUser] = React.useState<UserResponse | null>(null);

    React.useEffect(() => {
        const fetchUser = async () => {
            const userData = await getCurrentUser();
            setCurrentUser(userData);
        };

        fetchUser();
    }, []);

    return (
        <ScrollView>
            <ProfileHeaderScreen currentUser={currentUser} />

            <View style={styles.optionsContainer}>
                {OptionData.map((option, index) => (
                    <ProfileOptionScreen
                        key={index}
                        option={option}
                    />
                ))}
            </View>

            <ProfileFooterScreen />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    optionsContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 12,
        top: -30,
        elevation: 3,
        shadowColor: red[300],
        shadowOffset: { width: 0, height: 2 },
    }
});