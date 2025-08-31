import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import taekwondo from '@assets/taekwondo.jpg';
import HeaderBackground from '@/components/layout/HeaderApp/HeaderBackground';

export default function HomeHeaderScreen() {
    return (
        <View style={styles.container}>
            <HeaderBackground route='Home' />
            <View style={styles.content}>
                <Image source={taekwondo} style={styles.avatar} />
                <View style={styles.info}>
                    <Text style={styles.name}>Nguyễn Trung Đạt</Text>
                    <Text style={styles.mhv}>MHV: B25GOAT310</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative', // Để chứa absolute positioned content
    },
    content: {
        position: 'absolute', // Đặt content trên background
        top: 0,
        left: 15,
        right: 15,
        bottom: 0,
        flexDirection: 'row', // 👈 xếp theo hàng ngang
        alignItems: 'flex-start', // 👈 căn trên theo chiều dọc
        gap: 10,
        paddingTop: 50, // Tạo khoảng cách từ status bar
    },
    info: {
        paddingTop: 5
    },
    name: {
        fontSize: 20,
        fontWeight: '500',
        color: '#ffffffff',
    },
    mhv: {
        fontSize: 16,
        color: '#ffffffff',
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 27.5,      // bo tròn thành hình tròn
        borderColor: '#ffffffff',
        borderWidth: 2,
    },
});
