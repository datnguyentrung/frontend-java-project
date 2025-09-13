import {
    View, StyleSheet, ScrollView,
    RefreshControl, Animated, Easing
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import ClassSessionScreen from "./ClassSessionScreen";
import StudentAttendance from "./StudentAttendance";
import { getAllClassSessions } from "@/services/classSessionsService";
import { ClassSession } from "@/types/types";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import LoadingScreen from '@screens/LoadingScreen';

export default function StudentAttendanceScreen() {
    const [selectedClassSession, setSelectedClassSession] = React.useState<string | null>(null);
    const [listClassSessions, setListClassSessions] = React.useState<ClassSession[]>([]);
    const [status, setStatus] = useState<"attendance" | "evaluation">("attendance");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const navigation = useNavigation();

    // Animation value for rotating sync icon
    const rotateValue = useRef(new Animated.Value(0)).current;

    // Function to handle status change with animation
    const handleStatusChange = () => {
        if (isChangingStatus) return; // Prevent multiple clicks

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
                <Animated.View
                    style={[
                        {
                            marginRight: 16,
                        },
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
                            padding: 4, // Add some padding for better touch area
                            opacity: isChangingStatus ? 0.9 : 1,
                        }}
                    />
                </Animated.View>
            )
        });
    }, [navigation, status, rotate, isChangingStatus]);

    useEffect(() => {
        // Fetch class sessions from an API or data source
        const fetchClassSessions = async () => {
            try {
                setLoading(true);
                const sessions = await getAllClassSessions({ isActive: true });
                setListClassSessions(sessions);
            } catch (error) {
                console.error('Error fetching class sessions:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchClassSessions();
    }, []);

    // Pull to refresh function
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            setLoading(true);
            console.log('🔄 Refreshing class sessions...');
            const sessions = await getAllClassSessions({ isActive: true });
            setListClassSessions(sessions);
            // console.log('✅ Class sessions refreshed successfully');
        } catch (error) {
            console.error('❌ Error refreshing class sessions:', error);
        } finally {
            setRefreshing(false);
            setLoading(false);
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
                    listClassSessions={listClassSessions}
                />

                {/* Loading indicator when refreshing */}
                {loading ? <LoadingScreen />
                    : <StudentAttendance
                        selectedClassSession={selectedClassSession}
                        status={status}
                        refreshing={refreshing}
                        isChangingStatus={isChangingStatus}
                        onStatusChangeComplete={stopLoadingAnimation}
                    />
                }
            </ScrollView>
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
    }
})