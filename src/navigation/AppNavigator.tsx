import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import TabNavigator và feature screens
import TabNavigator from './TabNavigator';
import BranchScreen from '@/screens/BranchScreen/BranchScreen';
import StudentAttendanceScreen from '@/screens/StudentAttendanceScreen/StudentAttendanceScreen';
import NotFoundScreen from '@/screens/NotFoundScreen';
import HeaderBackground from '@/components/layout/HeaderApp/HeaderBackground';

// Tạo Stack Navigator
const Stack = createStackNavigator();

// Import icon AntDesign
import AntDesign from '@expo/vector-icons/AntDesign'

/**
 * AppNavigator - Navigator chính của app
 * Chứa TabNavigator và tất cả feature screens
 */
const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Tabs"
            screenOptions={{
                headerShown: true,
                // headerStyle: {
                //     backgroundColor: '#dc2626',
                // },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    // fontSize: 21
                },
                headerBackground: () => <HeaderBackground route='Tabs' />,
            }}
        >
            {/* Main Tabs */}
            <Stack.Screen
                name="Tabs"
                component={TabNavigator}
                options={{ headerShown: false }}
            />

            {/* Feature Screens */}
            <Stack.Screen
                name="BranchScreen"
                component={BranchScreen}
                options={{
                    title: 'Cơ sở',
                    headerBackTitle: 'Quay lại',
                    // headerLeft: () => null,  // ← Ẩn nút back hoàn toàn
                }}
            />

            <Stack.Screen
                name="StudentAttendanceScreen"
                component={StudentAttendanceScreen}
                options={{
                    title: "Điểm danh học viên",
                    headerBackTitle: "Quay lại",
                }}
            />

            {/* Placeholder screens cho các features khác */}
            <Stack.Screen
                name="GoatPointsScreen"
                component={NotFoundScreen}
                options={{
                    title: 'GOAT Points',
                    headerBackTitle: 'Quay lại'
                }}
            />

            <Stack.Screen
                name="TrainingTimeScreen"
                component={NotFoundScreen}
                options={{
                    title: 'Thời gian rèn luyện',
                    headerBackTitle: 'Quay lại'
                }}
            />

            <Stack.Screen
                name="SkillsScreen"
                component={NotFoundScreen}
                options={{
                    title: 'Kỹ năng',
                    headerBackTitle: 'Quay lại'
                }}
            />

            <Stack.Screen
                name="StatisticsScreen"
                component={NotFoundScreen}
                options={{
                    title: 'Thống kê',
                    headerBackTitle: 'Quay lại'
                }}
            />

            <Stack.Screen
                name="OtherFeaturesScreen"
                component={NotFoundScreen}
                options={{
                    title: 'Tính năng khác',
                    headerBackTitle: 'Quay lại'
                }}
            />

            {/* Thêm các screens khác ở đây */}
        </Stack.Navigator>
    );
};

export default AppNavigator;
