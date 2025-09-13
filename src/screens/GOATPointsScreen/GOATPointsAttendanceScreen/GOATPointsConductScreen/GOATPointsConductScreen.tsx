import React, { ComponentProps, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ConductScore, ScoreDataType } from '@/types/types';
import { red, blue, green, orange, purple, gray } from '@styles/colorTypes';
import Feather from '@expo/vector-icons/Feather'
import { formatDateDMY } from '@/utils/format';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

type ConductProps = {
    key: string,
    value: string,
    title: string,
    titleColor: string,
    count: number,
    iconComponent: FeatherIconName,
    iconColor?: string,
    backgroundColor?: string,
}

const initialConductData: ConductProps[] = [
    {
        key: 'trainingSession',
        value: 'X',
        title: 'Có mặt',
        titleColor: green[700],
        count: 0,
        iconComponent: 'check-circle',
        iconColor: green[600],
        backgroundColor: green[50],
    },
    {
        key: 'absentSession',
        value: 'V',
        title: 'Vắng mặt',
        titleColor: red[700],
        count: 0,
        iconComponent: 'x-circle',
        iconColor: red[500],
        backgroundColor: red[50],
    },
    {
        key: 'late',
        value: 'M',
        title: 'Muộn',
        titleColor: orange[700],
        count: 0,
        iconComponent: 'clock',
        iconColor: orange[500],
        backgroundColor: orange[50],
    },
    {
        key: 'compensatorySession',
        value: 'B',
        title: 'Học bù',
        titleColor: blue[700],
        count: 0,
        iconComponent: 'book-open',
        iconColor: blue[500],
        backgroundColor: blue[50],
    },
    {
        key: 'excusedAbsence',
        value: 'P',
        title: 'Phép',
        titleColor: purple[700],
        count: 0,
        iconComponent: 'file-text',
        iconColor: purple[500],
        backgroundColor: purple[50],
    },
];

export default function GOATPointsConductScreen({ scoreData }: { scoreData?: ScoreDataType }) {
    const [conductData, setConductData] = useState<ConductProps[]>(initialConductData);

    useEffect(() => {
        const updatedData = initialConductData.map(item => ({
            ...item,
            count: scoreData && scoreData.conductScore
                ? (scoreData.conductScore[item.key as keyof ConductScore] as number) || 0
                : 0
        }));
        setConductData(updatedData);
    }, [scoreData]);

    function renderHeader() {
        const conductScore = scoreData?.conductScore;
        const totalScore = conductScore?.score || 0;
        const quarter = scoreData?.quarter || 1;
        const year = scoreData?.year || 2024;

        // console.log("🚀 Score data :", scoreData);

        return (
            <View style={styles.header}>
                <Text style={styles.score}>{totalScore}</Text>
                <Text style={styles.quarter}>Điểm Rèn Luyện quý {quarter}/{year}</Text>

                {/* Calculation */}
                <View style={styles.calculation}>
                    <Text style={{ color: blue[700], fontWeight: 'bold' }}>Cách tính điểm</Text>
                    <Text style={{ color: blue[600], marginStart: 15, textDecorationLine: 'underline' }}>Nếu có mặt sớm tất cả các buổi</Text>
                    <Text style={{ color: blue[400], marginStart: 35 }}>DRL = 5đ</Text>
                    <Text style={{ color: blue[600], marginStart: 15, textDecorationLine: 'underline' }}>Các trường hợp còn lại</Text>
                    <Text style={{ color: blue[400], marginStart: 35 }}>DRL = 4đ - (Muộn x 0.5đ) - (Vắng mặt x 1đ) - (Phép x 1đ) + (Học bù x 0.5đ)</Text>
                </View>
            </View>
        );
    }

    function renderStatistic() {
        return (
            <View style={styles.statistics}>
                <View style={styles.titleContainer}>
                    <Feather name="calendar" size={26} color="black" />
                    <Text style={styles.title}>Thống kê đánh giá</Text>
                </View>

                {/* Conduct Details */}
                <View style={styles.conductDetails}>
                    {conductData.map((item: ConductProps) => {
                        return (
                            <View key={item.key} style={[styles.conductItem, { backgroundColor: item.backgroundColor }]}>
                                <Feather
                                    name={item.iconComponent} size={30}
                                    color={item.iconColor} />
                                <View style={{ justifyContent: 'flex-start' }}>
                                    <Text style={[styles.conductValue, { color: item.iconColor }]}>{item.count}</Text>
                                    <Text style={[styles.conductTitle, { color: item.titleColor }]}>{item.title}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        )
    }

    function AttendanceList() {
        return (
            <View style={styles.attendanceList}>
                <Text style={styles.attendanceListTitle}>Danh sách buổi học</Text>
                {scoreData?.listAttendance && scoreData.listAttendance.length > 0 ? (
                    scoreData.listAttendance
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((attendance, index) => {
                            const attendanceData = initialConductData.find(item => item.value === attendance.attendance);
                            return (
                                <View key={index} style={styles.attendanceItem}>
                                    <View style={styles.attendanceInfo}>
                                        <Feather
                                            name={attendanceData?.iconComponent as FeatherIconName}
                                            size={24}
                                            color={attendanceData?.iconColor} />
                                        <View>
                                            <Text style={{ fontSize: 18 }}>{formatDateDMY(new Date(attendance.date))}</Text>
                                            <Text style={{ color: '#666' }}>{attendance.attendanceTime} - {attendance.attendanceCoach}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.attendanceValue}>
                                        <Text style={[styles.attendanceText, { color: attendanceData?.titleColor, backgroundColor: attendanceData?.backgroundColor }]}>
                                            {initialConductData.find(item => item.value === attendance.attendance)?.title || 'Chưa rõ'}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })
                ) : (
                    <Text style={{ textAlign: 'center', paddingVertical: 12 }}>Không có dữ liệu điểm danh</Text>
                )}
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {renderHeader()}
            {renderStatistic()}
            {AttendanceList()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafb',
        flex: 1,
    },
    header: {
        backgroundColor: '#ffffffff',
        paddingTop: 20,
        paddingBottom: 16,
        alignItems: 'center',
    },
    score: {
        fontSize: 44,
        fontWeight: '400',
        textAlign: 'center',
        paddingBottom: 8,
        color: red[600],
    },
    quarter: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    calculation: {
        marginTop: 12,
        paddingVertical: 16,
        paddingHorizontal: 30,
        backgroundColor: blue[50],
        borderRadius: 12,
        borderColor: blue[200],
        borderWidth: 1,
        marginHorizontal: 20,
    },
    statistics: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 12,
        padding: 16,
        elevation: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
    },
    title: {
        fontSize: 18,
    },
    conductDetails: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    conductItem: {
        width: '47%',
        padding: 12,
        marginVertical: 8,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        borderRadius: 16,
    },
    conductTitle: {

    },
    conductValue: {
        fontWeight: 'bold',
        fontSize: 23,
    },
    attendanceList: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 12,
        padding: 16,
        elevation: 1,
    },
    attendanceListTitle: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 18,
    },
    attendanceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginLeft: 16,
    },
    attendanceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        marginVertical: 8,
        backgroundColor: gray[50],
        borderRadius: 16,
    },
    attendanceValue: {
        // alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    attendanceText: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        fontWeight: '500',
    }
});