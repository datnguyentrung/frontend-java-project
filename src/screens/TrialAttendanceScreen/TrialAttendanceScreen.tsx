import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { gray, green, red, yellow } from '@styles/colorTypes';
import { Attendance } from '@/types/AttendanceTypes';
import TrialAttendanceItemScreen from './TrialAttendanceItemScreen';
import { getTodayTrialAttendance } from '@/services/attendance/trialAttendanceService';

type Props = {
    setVisible?: (visible: boolean) => void;
}

const evaluationCategories = [
    { label: 'Tổng', key: 'All', count: 0, backGroundColor: gray[50], textColor: gray[700] },
    { label: 'Tốt', key: 'T', count: 0, backGroundColor: green[50], textColor: green[700] },
    { label: 'Trung bình', key: 'TB', count: 0, backGroundColor: yellow[50], textColor: yellow[700] },
    { label: 'Yếu', key: 'Y', count: 0, backGroundColor: red[50], textColor: red[700] },
];

const { width } = Dimensions.get('window');

export default function TrialAttendanceScreen({ setVisible }: Props) {
    const [trialAttendance, setTrialAttendance] = React.useState<Attendance[]>([]);

    // ✅ Function để refresh trial attendance data
    const refreshTrialAttendance = React.useCallback(async () => {
        try {
            console.log('🔄 Refreshing trial attendance data...');
            const data = await getTodayTrialAttendance();
            setTrialAttendance(data);
            console.log('✅ Trial attendance data refreshed');
        } catch (error) {
            console.error('❌ Error refreshing trial attendance data:', error);
        }
    }, []);

    // ✅ Tối ưu: Chỉ gọi API 1 lần khi component mount
    React.useEffect(() => {
        let isMounted = true;

        const loadTrialAttendanceData = async () => {
            try {
                const data = await getTodayTrialAttendance();
                if (isMounted) {
                    setTrialAttendance(data);
                }
            } catch (error) {
                console.error('Error loading trial attendance data:', error);
            }
        };

        loadTrialAttendanceData();

        return () => {
            isMounted = false;
        };
    }, []); // ✅ Dependency rỗng - chỉ gọi 1 lần khi mount

    // ✅ Tối ưu: Sử dụng useMemo để tính toán counts thay vì useEffect
    const evaluationCategoriesWithCounts = React.useMemo(() => {
        return evaluationCategories.map(category => {
            if (category.key === 'All') {
                return {
                    ...category,
                    count: trialAttendance.filter(item => item.attendanceInfo.evaluationStatus !== '').length
                };
            } else {
                return {
                    ...category,
                    count: trialAttendance.filter(item => item.attendanceInfo.evaluationStatus === category.key).length
                };
            }
        });
    }, [trialAttendance]);

    const handleEvaluationChange = (index: number, value: string) => {
        setTrialAttendance(prev => {
            const newData = [...prev];
            newData[index] = {
                ...newData[index],
                attendanceInfo: {
                    ...newData[index].attendanceInfo,
                    evaluationStatus: value
                }
            };
            return newData;
        });
    };

    const renderHeader = () => {
        return (
            <View style={styles.header}>
                {setVisible &&
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Điểm danh tập thử</Text>
                        <TouchableOpacity style={styles.xButton} onPress={() => setVisible(false)}>
                            <AntDesign name="close" size={16} color="black" />
                        </TouchableOpacity>
                    </View>
                }
                <View style={styles.headerEvaluation}>
                    {evaluationCategoriesWithCounts.map(category => {
                        return (
                            <View key={category.key} style={[styles.categoryContainer, {
                                backgroundColor: category.backGroundColor,
                            }]}>
                                <Text style={[styles.categoryCount, { color: category.textColor }]}>{category.count}</Text>
                                <Text style={[styles.categoryLabel, { color: category.textColor }]}>{category.label}</Text>
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }

    return (
        <View style={styles.modal}>
            <FlatList
                data={trialAttendance}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={renderHeader}
                renderItem={({ item, index }) => (
                    <TrialAttendanceItemScreen
                        item={item}
                        index={index}
                        onEvaluationChange={handleEvaluationChange}
                        refreshTrialAttendance={refreshTrialAttendance}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    modal: {
        width: '100%',
        height: '90%',
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        zIndex: 1000,
    },
    xButton: {
        padding: 15
    },
    header: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        paddingBottom: 10,
        marginBottom: 10,
    },
    headerContent: {
        backgroundColor: red[50],
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: red[600],
        marginLeft: 10,
    },
    headerEvaluation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    categoryContainer: {
        padding: 10,
        marginVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        width: (width - 100) / 4, // 4 categories with some margin
    },
    categoryCount: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    categoryLabel: {
        fontSize: 10,
    },
});