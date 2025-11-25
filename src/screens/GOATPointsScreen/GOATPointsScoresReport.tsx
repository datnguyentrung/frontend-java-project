import React, { ComponentProps } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { navigateToFeature } from '@/navigation/FeatureNavigator'
import { ConductScore, AwarenessScore, ScoreDataType } from '@/types/types';
import { StudentAttendanceDetail } from '@/types/attendance/StudentAttendanceTypes';
import { useAuth } from '@providers/AuthProvider';
import { getAttendancesByIdAccountAndQuarter } from '@/services/attendance/studentAttendanceService';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type FontAwesomeIconName = ComponentProps<typeof FontAwesome>['name'];

type Props = {
    title: string,
    iconComponent: FontAwesomeIconName,
    selectedQuarter: number,
    selectedYear: number,
    conductScore: ConductScore | null,
    awarenessScore: AwarenessScore | null,
}

export default function GOATPointsScoresReport({ title, iconComponent, selectedQuarter, selectedYear, conductScore, awarenessScore }: Props) {
    const navigation = useNavigation();
    const { userInfo } = useAuth();

    const percentage = title === "Điểm Rèn Luyện"
        ? 5.0
        : (((awarenessScore?.highScore ?? 0) * 5) +
            ((awarenessScore?.mediumScore ?? 0) * 5) +
            ((awarenessScore?.lowScore ?? 0) * 5) || 1);

    const [listAttendance, setListAttendance] = React.useState<StudentAttendanceDetail[]>([]);

    React.useEffect(() => {
        const fetchAttendance = async () => {
            if (userInfo?.idAccount) {
                try {
                    const data = await getAttendancesByIdAccountAndQuarter(userInfo.idAccount, selectedYear, selectedQuarter);
                    setListAttendance(data);
                    console.log("Attendance data:", data);
                } catch (error) {
                    console.error("Error fetching attendance data:", error);
                }
            }
        };
        fetchAttendance();
    }, [selectedQuarter, selectedYear]);

    // Hàm xử lý khi nhấn button
    const handleButtonPress = (buttonName: string) => {
        console.log('🚀 Feature pressed:', buttonName);

        let scoreData: ScoreDataType | null = null;

        if ((title === "Điểm Rèn Luyện" && conductScore) || (title === "Điểm Ý Thức" && awarenessScore)) {
            scoreData = {
                type: title,
                conductScore,
                awarenessScore,
                quarter: selectedQuarter,
                year: selectedYear,
                listAttendance,
            };
        }

        // console.log('Score data to pass:', scoreData);

        // Sử dụng navigation helper từ FeatureNavigator
        const success = navigateToFeature("Điểm điểm danh", navigation, scoreData);

        if (!success) {
            // Fallback alert nếu không tìm thấy screen
            Alert.alert(
                'Thông báo',
                `Tính năng "${buttonName}" đang được phát triển`,
                [{ text: 'OK', style: 'default' }]
            );
        }
    };

    return (
        <Pressable style={[styles.container, {
            borderLeftColor: title === "Điểm Rèn Luyện" ? "#e32a2aff" : "#f63cc1ff"
        }]} onPress={() => handleButtonPress(title)}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: title === "Điểm Rèn Luyện" ? "#ffe5e5" : "#fee5ffb2" }]}>
                        <FontAwesome name={iconComponent} size={24}
                            color={title === "Điểm Rèn Luyện" ? "#e32a2aff" : "#f63cc1ff"}
                        />
                    </View>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <Text>+0.5</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.scoreContainer}>
                    <Text style={[
                        styles.score,
                        { color: title === "Điểm Rèn Luyện" ? "#e32a2aff" : "#f63cc1ff" }
                    ]}>
                        {title === "Điểm Rèn Luyện"
                            ? (conductScore ? conductScore.score.toFixed(1) : 'N/A')
                            : (awarenessScore ? awarenessScore.score.toFixed(1) : 'N/A')}
                    </Text>
                    <Text style={styles.scoreTotal}>/ {percentage} điểm</Text>
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.time}>Quý {selectedQuarter}/{selectedYear}</Text>
                    <Text style={styles.rank}>Xếp hạng: Khá</Text>
                </View>
            </View>

            {/* Thanh Progress bar */}
            <View style={styles.progressBar}>
                <View style={[
                    styles.progressFill,
                    {
                        width: `${title === "Điểm Rèn Luyện"
                            ? ((conductScore?.score ?? 0) / percentage) * 100
                            : ((awarenessScore?.score ?? 0) / percentage) * 100
                            }%`,
                        backgroundColor:
                            title === "Điểm Rèn Luyện" ? "#e32a2aff" : "#f63cc1ff",
                    },
                ]} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 25,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderLeftWidth: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        padding: 12,
        borderRadius: "50%",
    },
    title: {
        fontSize: 21,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    scoreContainer: {
        alignItems: 'flex-start',
    },
    score: {
        fontSize: 30,
        fontWeight: '400',
    },
    scoreTotal: {
        color: '#666',
    },
    detailsContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    time: {
        color: '#666',
    },
    rank: {
        fontSize: 16,
        color: '#666',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e8e6e6ff',
        borderRadius: 6,
        marginTop: 20,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 6,
    }
});