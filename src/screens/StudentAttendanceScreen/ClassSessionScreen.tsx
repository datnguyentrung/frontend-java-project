import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons'
import { ClassSession } from "@/types/training/ClassSessionTypes";

type Props = {
    selectedClassSession: string | null,
    setSelectedClassSession: (session: string) => void,
    listClassSessions: ClassSession[]
};

const weekdays = [
    { key: 1, label: 'CN', context: 'SUNDAY' },
    { key: 2, label: 'T2', context: 'MONDAY' },
    { key: 3, label: 'T3', context: 'TUESDAY' },
    { key: 4, label: 'T4', context: 'WEDNESDAY' },
    { key: 5, label: 'T5', context: 'THURSDAY' },
    { key: 6, label: 'T6', context: 'FRIDAY' },
    { key: 7, label: 'T7', context: 'SATURDAY' },
]

export default function ClassSessionScreen({ selectedClassSession, setSelectedClassSession, listClassSessions }: Props) {
    const [filteredSessions, setFilteredSessions] = useState<ClassSession[]>([]);
    const [selectedWeekday, setSelectedWeekday] = React.useState<string | null>(
        new Date().getDay() === 0 ? 'SUNDAY' : weekdays[new Date().getDay()].context
    );

    // console.log(listClassSessions);

    useEffect(() => {
        let filtered;
        if (selectedWeekday !== null) {
            filtered = listClassSessions
                .filter(session => session.weekday === selectedWeekday)
                .sort((a, b) => a.idBranch - b.idBranch || a.shift.localeCompare(b.shift));
        } else {
            filtered = listClassSessions;
        }

        setFilteredSessions(filtered);

        // dùng luôn biến filtered chứ không phải filteredSessions
        setSelectedClassSession(filtered.length > 0 ? filtered[0].idClassSession : "");
    }, [selectedWeekday, listClassSessions]);

    return (
        <View style={styles.container}>
            {/* Weekday Selection */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Chọn ngày trong tuần</Text>
                <FlatList
                    data={weekdays}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.weekdayContainer}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[
                                styles.weekdayItem,
                                item.context === selectedWeekday && styles.activeWeekdayItem,
                            ]}
                            onPress={() => setSelectedWeekday(item.context)}
                        >
                            <Text style={[
                                styles.weekdayText,
                                item.context === selectedWeekday && styles.activeWeekdayText
                            ]}>
                                {item.label}
                            </Text>
                        </Pressable>
                    )}
                    keyExtractor={item => item.key.toString()}
                />
            </View>

            {/* Class Session Selection */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Chọn lớp học</Text>
                <View style={styles.classSessionContainer}>
                    {filteredSessions

                        .map((session) => (
                            <Pressable
                                key={session.idClassSession}
                                style={[
                                    styles.classSessionItem,
                                    selectedClassSession === session.idClassSession && styles.activeClassSessionItem
                                ]}
                                onPress={() => {
                                    setSelectedClassSession(session.idClassSession);
                                }}
                            >
                                <LinearGradient
                                    colors={selectedClassSession === session.idClassSession
                                        ? ['#ff5252', '#ff1744']
                                        : ['#ffffff', '#f5f5f5']
                                    }
                                    style={styles.classSessionGradient}
                                >
                                    <View style={styles.classSessionHeader}>
                                        <Ionicons
                                            name="business-outline"
                                            size={20}
                                            color={selectedClassSession === session.idClassSession ? '#fff' : '#666'}
                                        />
                                        <Text style={[
                                            styles.branchText,
                                            selectedClassSession === session.idClassSession && styles.activeText
                                        ]}>
                                            Cơ sở {session.idBranch}
                                        </Text>
                                    </View>
                                    <View style={styles.classSessionDetails}>
                                        <View style={styles.detailRow}>
                                            <Ionicons
                                                name="time-outline"
                                                size={16}
                                                color={selectedClassSession === session.idClassSession ? '#fff' : '#666'}
                                            />
                                            <Text style={[
                                                styles.sessionDetailText,
                                                selectedClassSession === session.idClassSession && styles.activeText
                                            ]}>
                                                {session.session === 'am' ? 'Sáng' : 'Tối'} - Ca {session.shift.replace('SHIFT_', '')}
                                            </Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Ionicons
                                                name="location-outline"
                                                size={16}
                                                color={selectedClassSession === session.idClassSession ? '#fff' : '#666'}
                                            />
                                            <Text style={[
                                                styles.sessionDetailText,
                                                selectedClassSession === session.idClassSession && styles.activeText
                                            ]}>
                                                {session.location === 'INDOOR' ? 'Phòng tập' : 'Ngoài sân'}
                                            </Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </Pressable>
                        ))}
                </View>
                {filteredSessions.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={48} color="#ccc" />
                        <Text style={styles.emptyText}>Không có lớp học nào trong ngày này</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        // padding: 10,
        paddingTop: 10,
        marginBottom: 10,
        marginHorizontal: 5,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    sectionContainer: {
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    weekdayContainer: {
        paddingHorizontal: 4,
        paddingBottom: 4,
    },
    weekdayItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f1f3f4',
        borderRadius: 25,
        marginHorizontal: 6,
        minWidth: 50,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    activeWeekdayItem: {
        backgroundColor: '#ff5252',
        elevation: 4,
        shadowOpacity: 0.2,
    },
    weekdayText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    activeWeekdayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    classSessionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    classSessionItem: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        flex: 1,
        minWidth: '40%',
        maxWidth: '48%',
        marginBottom: 8,
    },
    activeClassSessionItem: {
        elevation: 8,
        shadowOpacity: 0.25,
        transform: [{ scale: 1.02 }],
    },
    classSessionGradient: {
        padding: 16,
        borderRadius: 16,
        minHeight: 100,
        justifyContent: 'space-between',
    },
    classSessionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    branchText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#333',
    },
    activeText: {
        color: '#fff',
    },
    classSessionDetails: {
        gap: 6,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sessionDetailText: {
        fontSize: 14,
        marginLeft: 6,
        color: '#666',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
        textAlign: 'center',
    },
    // Legacy styles for backward compatibility
    item: {
        padding: 15,
        backgroundColor: "#eee",
        borderRadius: 30,
        marginHorizontal: 4,
    },
});