import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { House, User, Bell, LayoutGrid, ScanLine } from 'lucide-react-native';

// Import các màn hình
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FeaturesScreen from '../screens/FeaturesScreen/FeaturesScreen';
import NotificationScreen from '@/screens/NotificationScreen/NotificationScreen';
import ScanScreen from '@/screens/ScanScreen/ScanScreen';

/**
 * TabNavigator - Component quản lý thanh điều hướng dưới cùng
 * Sử dụng React Navigation Bottom Tabs để tạo navigation
 */

// Tạo Bottom Tab Navigator
const Tab = createBottomTabNavigator();

/**
 * Component tùy chỉnh cho icon của tab
 * @param {string} iconText - Text hiển thị làm icon (emoji hoặc ký tự)
 * @param {boolean} focused - Trạng thái tab có được chọn hay không
 * @param {string} color - Màu của icon
 * @param {boolean} alwaysActive - Luôn hiển thị dạng active (dành cho tab đặc biệt)
 * @param {boolean} noLabel - Không có label, icon sẽ chiếm toàn bộ chiều cao
 */
const TabIcon = ({ IconComponent, focused, color, alwaysActive = false, noLabel = false }: any) => {
    const iconColor = alwaysActive ? '#ff0000ff' : color;

    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: noLabel ? 1 : undefined,  // Chiếm toàn bộ chiều cao khi không có label
            height: noLabel ? '100%' : undefined,  // Chiều cao 100% khi không có label
        }}>
            <IconComponent
                size={alwaysActive ? 35 : (focused ? 26 : 22)}  // Tab đặc biệt to hơn
                color={iconColor}
            />
        </View>
    );
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={() => ({
                // Cấu hình chung cho tất cả tabs
                tabBarActiveTintColor: '#b10000ff', // Màu khi tab được chọn
                tabBarInactiveTintColor: '#666',  // Màu khi tab không được chọn
                tabBarStyle: {
                    backgroundColor: '#ffffffff',       // Màu nền của tab bar
                    borderTopWidth: 1,            // Độ dày viền trên
                    borderTopColor: '#e0e0e0',    // Màu viền trên
                    height: 80,                   // Chiều cao tab bar
                    paddingBottom: 10,            // Khoảng cách dưới
                    paddingTop: 10,               // Khoảng cách trên
                },
                tabBarItemStyle: {
                    // Style cho toàn bộ tab item
                    alignItems: 'center',         // Căn giữa theo chiều ngang
                    justifyContent: 'center',     // Căn giữa theo chiều dọc
                },
                tabBarIconStyle: {
                    // Style riêng cho icon
                    marginBottom: 2,              // Khoảng cách giữa icon và label
                },
                tabBarLabelStyle: {
                    fontSize: 12,                 // Kích thước chữ label
                    fontWeight: '500',            // Độ đậm chữ
                    textAlign: 'center',          // Căn giữa text
                },
                headerShown: false,
            })}
        >
            {/* Tab Home - Màn hình chính */}
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Trang chủ',     // Label dưới icon
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon IconComponent={House} focused={focused} color={color} />
                    ),
                }}
            />

            {/* Tab Feature - Màn hình tiện ích */}
            <Tab.Screen
                name="Feature"
                component={FeaturesScreen}
                options={{
                    tabBarLabel: 'Tiện ích',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon IconComponent={LayoutGrid} focused={focused} color={color} />
                    ),
                }}
            />

            {/* Tab Scan - Màn hình quét */}
            <Tab.Screen
                name="Scan"
                component={ScanScreen}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon
                            IconComponent={ScanLine}
                            focused={focused}
                            color={color}
                            alwaysActive={true}  // Luôn hiển thị dạng active và to hơn
                            noLabel={true}       // Không có label, icon chiếm toàn bộ chiều cao
                        />
                    ),
                    tabBarIconStyle: {
                        // Căn giữa icon theo cả chiều ngang và dọc
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        bottom: -5,

                    },
                }}
            />

            {/* Tab Notification - Màn hình thông báo */}
            <Tab.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    // title: 'Thông báo',
                    tabBarLabel: 'Thông báo',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon IconComponent={Bell} focused={focused} color={color} />
                    ),
                }}
            />

            {/* Tab Profile - Màn hình hồ sơ */}
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    // title: 'Cá nhân',
                    tabBarLabel: 'Cá nhân',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon IconComponent={User} focused={focused} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
