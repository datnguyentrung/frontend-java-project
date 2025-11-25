import {
    View, StyleSheet, ScrollView, TouchableOpacity,
    RefreshControl, Animated, Easing,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import ClassSessionScreen from "./ClassSessionScreen";
import StudentAttendance from "./StudentAttendance";
import { useNavigation } from "@react-navigation/native";
import AntDesign from '@expo/vector-icons/AntDesign'
import LoadingScreen from '@screens/LoadingScreen';
import TrialAttendanceScreen from '../TrialAttendanceScreen/TrialAttendanceScreen';
import Modal from 'react-native-modal';
import { useClassSessions } from '@/hooks/useClassSessions';

export default function StudentAttendanceScreen() {
    const [selectedClassSession, setSelectedClassSession] = React.useState<string | null>(null);
    const [status, setStatus] = useState<"attendance" | "evaluation">("attendance");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const navigation = useNavigation();

    const { classSessions, loading: classSessionsLoading } = useClassSessions();

    // Animation value for rotating sync icon
    const rotateValue = useRef(new Animated.Value(0)).current;

    // Function to handle status change with animation
    const handleStatusChange = () => {
        if (isChangingStatus) return; // Prevent multiple clicks

        console.log(`🔄 Switching status from ${status} to ${status === "attendance" ? "evaluation" : "attendance"}`);
        setIsChangingStatus(true);

        // Start continuous rotation animation
        const rotateAnimation = Animated.loop(
            Animated.timing(rotateValue, {
                toValue: 1,
                duration: 1000, // 1 second per rotation
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            { iterations: -1 } // Infinite loop
        );

        // Start animation immediately
        rotateAnimation.start();

        // Change status immediately for instant feedback
        setStatus((prev) => (prev === "attendance" ? "evaluation" : "attendance"));
    };

    // Function to stop the loading animation (called when StatusIcons finish loading)
    const stopLoadingAnimation = React.useCallback(() => {
        if (isChangingStatus) {
            // Small delay to ensure user sees the change
            setTimeout(() => {
                rotateValue.stopAnimation(() => {
                    rotateValue.setValue(0);
                    setIsChangingStatus(false);
                });
            }, 500); // Minimum loading time for UX
        }
    }, [isChangingStatus, rotateValue]);

    // Create rotation interpolation
    const rotate = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ marginRight: 16, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <TouchableOpacity>
                        <AntDesign
                            name='audit'
                            size={24}
                            color='#fff'
                            onPress={() => setVisible(true)}
                            style={{ padding: 8 }} // Add some padding for better touch area
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Animated.View
                            style={[
                                isChangingStatus && {
                                    transform: [{ rotate }],
                                }
                            ]}
                        >
                            <AntDesign
                                name="sync"
                                size={24}
                                color={isChangingStatus ? "#ffeb3b" : "white"}
                                onPress={isChangingStatus ? undefined : handleStatusChange}
                                style={{
                                    padding: 10, // Add some padding for better touch area
                                    opacity: isChangingStatus ? 0.9 : 1,
                                }}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation, status, rotate, isChangingStatus]);

    // Pull to refresh function
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            setLoading(true);
            setIsChangingStatus(true);
            // Simulate data refresh
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('🔄 Refreshing class sessions...');

        } catch (error) {
            console.error('❌ Error refreshing data:', error);
        } finally {
            setRefreshing(false);
            setLoading(false);
            setIsChangingStatus(false);
        }
    }, []);

    useEffect(() => {
        if (loading) {
            setLoading(false);
            console.log('loading...');
        }
    }, [loading]);

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#ff5252', '#ff1744']} // Android
                        tintColor="#ff5252" // iOS
                        title="Đang làm mới..." // iOS
                        titleColor="#666" // iOS
                    />
                }
            >
                <ClassSessionScreen
                    selectedClassSession={selectedClassSession}
                    setSelectedClassSession={setSelectedClassSession}
                    listClassSessions={classSessions.filter(cs => cs.isActive)}
                />

                {/* Loading indicator when refreshing */}
                {loading ? <LoadingScreen />
                    : <StudentAttendance
                        selectedClassSession={selectedClassSession}
                        status={status}
                        isChangingStatus={isChangingStatus}
                        onStatusChangeComplete={stopLoadingAnimation}
                    />
                }
            </ScrollView>

            {/* Trial Attendance Modal */}
            <Modal
                isVisible={visible}               // kiểm soát hiển thị modal
                animationIn="fadeIn"               // hiệu ứng hiện modal
                animationOut="fadeOut"           // hiệu ứng ẩn modal
                animationInTiming={100}               // thời gian animation hiện
                animationOutTiming={100}              // thời gian animation ẩn
                backdropTransitionInTiming={100}      // thời gian fade của nền khi hiện
                backdropTransitionOutTiming={100}     // thời gian fade của nền khi ẩn
                backdropOpacity={0.5}                 // độ mờ của nền
                onBackdropPress={() => setVisible(false)} // tắt modal khi nhấn nền
                onSwipeComplete={() => setVisible(false)} // tắt modal khi swipe xuống
                swipeDirection="down"                 // hướng swipe để đóng
                useNativeDriver                        // dùng native driver cho animation mượt
                useNativeDriverForBackdrop
                statusBarTranslucent
                coverScreen
                style={styles.modalStyle}             // style cho modal
            >
                <TrialAttendanceScreen
                    setVisible={setVisible}
                    isModal={true}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    scrollContent: {
        paddingVertical: 10,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    row: {
        gap: 5
    },
    modalStyle: {
        justifyContent: 'center',  // modal xuất hiện từ dưới lên
        alignItems: 'center',
        overflow: 'hidden',
        margin: 0,                   // modal full width
        padding: 20,
    },
})