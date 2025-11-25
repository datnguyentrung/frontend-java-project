import React, { ComponentProps } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Feather from '@expo/vector-icons/Feather'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { red, orange, green, gray, pink } from '@/styles/colorTypes'
import { ScoreDataType } from '@/types/types';
import { useRoute } from '@react-navigation/native';
import { formatDateDMY } from '@/utils/format';

type FontAwesome5IconName = ComponentProps<typeof FontAwesome5>['name'];

type dataProps = {
    key: string,
    evaluation: string,
    value: string,
    title: string,
    count: number,
    iconComponent: FontAwesome5IconName,
    backgroundColor: string,
    titleColor: string,
    itemColor: string,
    progressbar: string,
}

const mockData: dataProps[] = [
    {
        key: 'highScore',
        evaluation: 'T',
        value: 'Tốt',
        title: 'Tốt (5 điểm)',
        count: 24,
        iconComponent: "star",
        backgroundColor: green[50],
        titleColor: green[700],
        itemColor: green[600],
        progressbar: green[200]
    },
    {
        key: 'mediumScore',
        evaluation: 'TB',
        value: 'Trung bình',
        title: 'Trung bình (3 điểm)',
        count: 3,
        iconComponent: "meh",
        backgroundColor: orange[50],
        titleColor: orange[700],
        itemColor: orange[500],
        progressbar: orange[200]
    },
    {
        key: 'lowScore',
        evaluation: 'Y',
        value: 'Yếu',
        title: 'Yếu (0 điểm)',
        count: 1,
        iconComponent: "frown",
        backgroundColor: red[50],
        titleColor: red[700],
        itemColor: red[500],
        progressbar: red[200]
    },
]

export default function GOATPointsAwarenessScreen({ scoreData }: { scoreData?: ScoreDataType }) {
    function renderHeader() {
        const awarenessData = scoreData?.awarenessScore;
        const totalScore = awarenessData?.score || 0;
        const quarter = scoreData?.quarter || 1;
        const year = scoreData?.year || 2024;

        return (
            <View style={styles.header}>
                <Text style={styles.score}>{totalScore}</Text>
                <Text style={styles.quarter}>Điểm Ý Thức quý {quarter}/{year}</Text>
                <Text style={styles.completion}>(92.1% hoàn thành)</Text>

                {/* Calculation */}
                <View style={styles.calculation}>
                    <Text>Cách tính điểm</Text>
                    <Text>DYT = Tổng điểm tất cả buổi</Text>
                    <Text>Tốt (5đ) x {awarenessData?.highScore || 0} + Trung bình (3đ) x {awarenessData?.mediumScore || 0} + Yếu (0đ) x {awarenessData?.lowScore || 0} = {totalScore}</Text>
                </View>
            </View>
        );
    }

    function renderStatistics() {
        const awarenessData = scoreData?.awarenessScore;

        return (
            <View style={styles.statistics}>
                <View style={styles.titleContainer}>
                    <Feather name="calendar" size={26} color="black" />
                    <Text style={styles.title}>Thống kê đánh giá</Text>
                </View>

                {mockData.map((item, index) => {
                    // Get real score data based on key
                    let realCount = 0;
                    let realPoint = 0
                    if (awarenessData) {
                        switch (item.key) {
                            case 'highScore':
                                realCount = awarenessData.highScore || 0;
                                realPoint = awarenessData.highScore * 5 || 0;
                                break;
                            case 'mediumScore':
                                realCount = awarenessData.mediumScore || 0;
                                realPoint = awarenessData.mediumScore * 3 || 0;
                                break;
                            case 'lowScore':
                                realCount = awarenessData.lowScore || 0;
                                break;
                            default:
                                realCount = item.count; // fallback to mock data
                        }
                    } else {
                        realCount = item.count; // fallback to mock data if no real data
                    }

                    let realWidth = item.key !== 'lowScore'
                        ? Math.min((realPoint / (awarenessData?.score || 1)) * 100, (awarenessData?.score || 1))
                        : (realCount / 3) * 100;

                    return (
                        <View key={index} style={[
                            styles.evaluationStatistic,
                            { backgroundColor: item.backgroundColor }
                        ]}>
                            <FontAwesome5 name={item.iconComponent} size={30} color={item.itemColor} />
                            <View style={styles.content}>
                                <View style={styles.label}>
                                    <Text style={{ color: item.titleColor, fontSize: 20 }}>{item.title}</Text>
                                    <Text style={{ color: item.itemColor, fontSize: 20 }}>x{realCount}</Text>
                                </View>
                                {/* Thanh Progress bar */}
                                <View style={[styles.progressBar, { backgroundColor: item.progressbar }]}>
                                    <View style={[styles.progressFill, {
                                        width: `${realWidth}%`, // Dynamic percentage based on real data
                                        backgroundColor: item.itemColor
                                    }]} />
                                </View>
                            </View>
                        </View>
                    )
                })}
            </View>
        )
    }

    function EvaluationList() {
        return (
            <View style={styles.evaluationList}>
                <Text style={styles.evaluationListTitle}>Danh sách đánh giá</Text>
                {scoreData?.listAttendance && scoreData.listAttendance
                    .filter(item => item.attendance.attendanceStatus !== 'V' && item.attendance.attendanceStatus !== 'P')
                    .sort((a, b) => a.attendanceDate.getTime() - b.attendanceDate.getTime())    // Sắp xếp theo ngày cũ nhất
                    .map((item, index) => (
                        <View key={index} style={styles.listAttendanceItem}>
                            <View style={styles.attendanceItem}>
                                <View style={styles.attendanceLabel}>
                                    <View style={styles.titleLabel}>
                                        <View style={{ justifyContent: 'flex-start', marginTop: 10 }}>
                                            <FontAwesome5
                                                name={mockData.find(md => md.evaluation === item.evaluation.evaluationStatus)?.iconComponent}
                                                size={18} color={mockData.find(md => md.evaluation === item.evaluation.evaluationStatus)?.itemColor}
                                            />
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 18 }}>{formatDateDMY(item.attendanceDate)}</Text>
                                            <Text style={{ color: gray[500] }}>
                                                {item.evaluation.coach?.coachName || ''}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={styles.evaluationScore}>
                                            {item.evaluation.evaluationStatus === 'T' ? 5 : item.evaluation.evaluationStatus === 'TB' ? 3 : 0}đ
                                        </Text>
                                        <View style={[
                                            styles.evaluationValue,
                                            { backgroundColor: mockData.find(md => md.evaluation === item.evaluation.evaluationStatus)?.progressbar }
                                        ]}>
                                            <Text style={{
                                                fontSize: 15, fontWeight: '500',
                                                color: mockData.find(md => md.evaluation === item.evaluation.evaluationStatus)?.titleColor
                                            }}>
                                                {mockData.find(md => md.evaluation === item.evaluation.evaluationStatus)?.value}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.noteContainer}>
                                    <Text style={styles.noteText}>{item.notes || "Không có ghi chú"}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {renderHeader()}
            {renderStatistics()}
            {EvaluationList()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
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
        color: '#f6339a'
    },
    quarter: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    completion: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    calculation: {
        marginTop: 12,
        paddingVertical: 16,
        paddingHorizontal: 30,
        backgroundColor: '#fdf2f8',
        borderRadius: 12,
        borderColor: '#fccee8',
        borderWidth: 1,
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
    content: {
        flex: 1,
    },
    label: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
    },
    evaluationStatistic: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        gap: 12,
        paddingHorizontal: 16,
        marginVertical: 12,
        borderRadius: 12,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e8e6e6ff',
        borderRadius: 6,
        marginTop: 13,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 6,
    },
    evaluationList: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 12,
        padding: 16,
        elevation: 1,
    },
    evaluationListTitle: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 18,
    },
    listAttendanceItem: {
        marginVertical: 8,
        paddingVertical: 15,
        paddingHorizontal: 16,
        backgroundColor: gray[50],
        borderRadius: 12,
    },
    attendanceItem: {
        // marginVertical: 8,
    },
    attendanceLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleLabel: {
        flexDirection: 'row',
        gap: 12,
    },
    noteContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 8,
        marginTop: 8,
        borderLeftColor: pink[300],
        borderLeftWidth: 3,
    },
    noteText: {
        // fontStyle: 'italic',
        color: gray[500]
    },
    evaluationScore: {
        color: pink[500],
        fontSize: 25,
    },
    evaluationValue: {
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginTop: 5,
    }
});