import React from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, TextInput } from 'react-native';
import { Search } from 'lucide-react-native'
import HomeScheduleScreen from '@screens/HomeScreen/HomeScheduleScreen';
import Divider from '@components/layout/Divider';
import HomeHeaderScreen from './HomeHeaderScreen';
/**
 * HomeScreen - Màn hình chính của app
 * Đây là màn hình đầu tiên người dùng sẽ thấy khi mở app
 */
const HomeScreen = () => {
    // Hàm xử lý khi nhấn button
    const handleButtonPress = (buttonName: string) => {
        Alert.alert(
            'Thông báo',
            `Bạn đã nhấn button: ${buttonName}`,
            [{ text: 'OK', style: 'default' }]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View>
                <HomeHeaderScreen />
            </View>
            {/* Tìm kiếm chức năng và Lịch tập - Overlay trên Header */}
            <View style={styles.overlayElement}>
                {/* Tìm kiếm chức năng */}
                <View style={[styles.overlayContainer, { flexDirection: 'row', backgroundColor: '#rgba(255, 255, 255, 0.7)' }]}>
                    <Search size={20} color="#666" style={{ marginRight: 4, marginLeft: 8 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm..."
                    />
                </View>

                {/* Lịch và nội dung tập luyện */}
                <View style={[styles.overlayContainer, styles.calendar]}>
                    <HomeScheduleScreen />
                    <HomeScheduleScreen />
                    <View style={{ width: '100%', marginTop: 10 }}>
                        <Text style={styles.seeMoreSchedule}>Xem thêm →</Text>
                    </View>
                </View>
            </View>

            {/* Spacer để tạo khoảng trống cho overlay */}
            <View style={styles.spacer} />

            {/* Thanh ngang phân cách */}
            <Divider />

            {/* Chức năng */}
            <View style={styles.featuresSection}>
                <Text>Hehehe</Text>
            </View>
            <View><Text>Nội dung 1</Text></View>
            <View><Text>Nội dung 2</Text></View>
            <View><Text>Nội dung 3</Text></View>
            <View><Text>Nội dung 4</Text></View>
            <View><Text>Nội dung 5</Text></View>
            <View><Text>Nội dung 6</Text></View>
            <View><Text>Nội dung 7</Text></View>
            <View><Text>Nội dung 8</Text></View>
            <View><Text>Nội dung 9</Text></View>
            <View><Text>Nội dung 10</Text></View>
            <View><Text>Nội dung 11</Text></View>
            <View><Text>Nội dung 12</Text></View>
            <View><Text>Nội dung 13</Text></View>
            <View><Text>Nội dung 14</Text></View>
            <View><Text>Nội dung 15</Text></View>
            <View><Text>Nội dung 16</Text></View>
            <View><Text>Nội dung 17</Text></View>
            <View><Text>Nội dung 18</Text></View>
            <View><Text>Nội dung 19</Text></View>
            <View><Text>Nội dung 20</Text></View>
            <View><Text>Nội dung 21</Text></View>
            <View><Text>Nội dung 22</Text></View>
            <View><Text>Nội dung 23</Text></View>
            <View><Text>Nội dung 24</Text></View>
            <View><Text>Nội dung 25</Text></View>
            <View><Text>Nội dung 26</Text></View>
            <View><Text>Nội dung 27</Text></View>
            <View><Text>Nội dung 28</Text></View>
            <View><Text>Nội dung 29</Text></View>
            <View><Text>Nội dung 30</Text></View>
            <View><Text>Nội dung 31</Text></View>
            <View><Text>Nội dung 32</Text></View>
            <View><Text>Nội dung 33</Text></View>
            <View><Text>Nội dung 34</Text></View>
            <View><Text>Nội dung 35</Text></View>
            <View><Text>Nội dung 36</Text></View>
            <View><Text>Nội dung 37</Text></View>
            <View><Text>Nội dung 38</Text></View>
            <View><Text>Nội dung 39</Text></View>
            <View><Text>Nội dung 40</Text></View>
            <View><Text>Nội dung 41</Text></View>
            <View><Text>Nội dung 42</Text></View>
            <View><Text>Nội dung 43</Text></View>
            <View><Text>Nội dung 44</Text></View>
            <View><Text>Nội dung 45</Text></View>
            <View><Text>Nội dung 46</Text></View>
            <View><Text>Nội dung 47</Text></View>
            <View><Text>Nội dung 48</Text></View>
            <View><Text>Nội dung 49</Text></View>
            <View><Text>Nội dung 50</Text></View>

        </ScrollView >
    );
};

// Styles cho component này
const styles = StyleSheet.create({
    container: {
        flex: 1, // Chiếm toàn bộ không gian có sẵn
        backgroundColor: 'rgba(255, 255, 255, 1)', // Màu nền trắng với độ trong suốt
        position: 'relative', // Để chứa absolute elements
    },
    overlayElement: {
        position: 'absolute',
        top: 120, // Điều chỉnh để hiển thị trong phần cuối của header
        left: 15,
        right: 15,
        zIndex: 999,
        gap: 15,
    },
    calendar: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: 8
    },
    spacer: {
        height: 60, // Tạo khoảng trống để overlay không che phần bên dưới
    },
    overlayContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)', // Nền trắng
        borderRadius: 12,         // Bo góc
        paddingVertical: 4,
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    featuresSection: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 20,
        backgroundColor: '#ffffffff',
    },
    title: {
        fontSize: 24, // Kích thước chữ lớn
        fontWeight: 'bold', // Chữ đậm
        color: '#333', // Màu chữ xám đậm
        marginBottom: 10, // Khoảng cách dưới
    },
    subtitle: {
        fontSize: 16,
        color: '#666', // Màu chữ xám vừa
        textAlign: 'center', // Căn giữa text
        marginBottom: 20,
    },
    description: {
        fontSize: 14,
        color: '#888', // Màu chữ xám nhạt
        textAlign: 'center',
        lineHeight: 20, // Khoảng cách giữa các dòng
        marginBottom: 30, // Thêm margin để cách với button container
    },
    buttonContainer: {
        width: '100%', // Chiếm toàn bộ chiều rộng
        alignItems: 'center', // Căn giữa các button
    },
    seeMoreSchedule: {
        fontSize: 14,
        color: '#dc2626',
        marginRight: 6,
        letterSpacing: 0.3,
        justifyContent: 'center',
        textAlign: 'center',
    },
});

export default HomeScreen;
