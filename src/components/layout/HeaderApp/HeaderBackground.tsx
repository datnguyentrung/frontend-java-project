import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

import taekwondo from '@assets/taekwondo.jpg';

/**
 * Component tạo background cho header với hình ảnh và gradient
 * Hiệu ứng: hình taekwondo nhạt dần từ trên xuống dưới
 */
export default function HeaderBackground({ route }: { route: string }) {
    return (
        <View style={[styles.container, { height: route === 'Home' ? 400 : 130 }]}>
            <ImageBackground
                source={taekwondo}
                style={[styles.imageBackground, {
                    height: route === 'Home' ?
                        `${100 + (Constants.statusBarHeight / 4)}%` :
                        `${160 + (Constants.statusBarHeight / 1.3)}%`, // Tăng height để bù status bar
                    transform: route === 'Home' ?
                        [
                            { translateY: 0 },
                            { scale: 1.1 },
                        ] :
                        [
                            { translateX: -50 },
                            { translateY: -75 },
                            { scale: 0.9 },
                            { rotate: '10deg' },     // xoay nhẹ
                            { rotateY: '15deg' },    // nghiêng trục Y, tạo chiều sâu
                            { skewX: '5deg' },       // méo theo trục X
                        ], // Di chuyển ảnh lên thay vì cắt
                }]}
                resizeMode="cover"           // Giữ tỷ lệ ảnh, cắt phần thừa
            />
            {/* Gradient overlay để tạo hiệu ứng từ đỏ trên xuống trắng dưới */}
            <LinearGradient
                colors={route === 'Home' ? [
                    'rgba(255, 42, 0, 0.9)',    // Đầu: màu đỏ chuẩn đậm (90% opacity)
                    'rgba(255, 42, 0, 0.3)',    // Giữa: màu đỏ vừa (30% opacity)   
                    'rgba(255, 255, 255, 0.8)', // Cuối: màu trắng hòa (80% opacity)
                ] : [
                    'rgba(255, 0, 0, 0.22)',
                    'rgba(255, 42, 0, 0.71)',
                ]}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}     // Bắt đầu từ trên
                end={{ x: 0, y: 1 }}       // Kết thúc ở dưới
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        backgroundColor: '#fff',
        // backfaceVisibility: 'hidden',
        // position: 'absolute', // Thay đổi từ flex: 1 thành position absolute
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
    },
    imageBackground: {
        position: 'absolute',    // Vị trí tuyệt đối
        top: -10,                  // Luôn bắt đầu từ top = 0
        left: 3,                 // Cố định từ trái
        right: 0,                // Cố định từ phải
        bottom: 0,               // Cố định từ dưới (luôn phủ đầy)
        width: '100%',           // Chiều rộng 100%
    },
    linearGradient: {
        flex: 1,
    },
});
