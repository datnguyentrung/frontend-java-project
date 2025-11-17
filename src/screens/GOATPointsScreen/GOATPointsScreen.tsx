import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getScoresByQuarter } from '@/services/summary';
import { useAuth } from '@providers/AuthProvider';
import { ConductScore, AwarenessScore, SummaryScore } from "@/types/types";
import GOATPointsTimeScreen from './GOATPointsTimeScreen';
import LoadingScreen from '../LoadingScreen';
import GOATPointsScoresReport from './GOATPointsScoresReport';
import GOATPointsOverview from './GOATPointsOverview';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ComponentProps } from 'react'

type FontAwesomeIconName = ComponentProps<typeof FontAwesome>['name'];

type ReportItem = {
    title: string;
    iconComponent: FontAwesomeIconName;  // ✅ type đúng
    label: string;
}

const data: ReportItem[] = [
    {
        title: "Điểm Rèn Luyện",
        iconComponent: 'bar-chart' as FontAwesomeIconName,
        label: 'awarenessScore'
    },
    {
        title: "Điểm Ý Thức",
        iconComponent: 'heart-o' as FontAwesomeIconName,
        label: 'consciousnessScore'
    }
]

export default function GOATPointsScreen() {
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(false);

    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedQuarter, setSelectedQuarter] = useState<number>(new Date().getMonth() < 3 ? 1 : new Date().getMonth() < 6 ? 2 : new Date().getMonth() < 9 ? 3 : 4);
    const [goatPoints, setGoatPoints] = useState<SummaryScore | null>(null);

    const [conductScore, setConductScore] = useState<ConductScore | null>(null);
    const [awarenessScore, setAwarenessScore] = useState<AwarenessScore | null>(null);

    useEffect(() => {
        const fetchGOATPoints = async () => {
            if (userInfo?.idAccount && selectedYear) {
                try {
                    setLoading(true);
                    const data = await getScoresByQuarter(selectedYear, selectedQuarter, userInfo.idAccount);
                    setGoatPoints(data);
                } catch (error) {
                    console.error("Error fetching GOAT points:", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchGOATPoints();
    }, [userInfo?.idAccount, selectedYear, selectedQuarter]);

    useEffect(() => {
        if (goatPoints) {
            setConductScore(goatPoints.conductScore);
            setAwarenessScore(goatPoints.awarenessScore);
        } else {
            setConductScore(null);
            setAwarenessScore(null);
        }
    }, [goatPoints, selectedQuarter]);

    const renderGOATPoints = () => {
        if (!goatPoints) {
            return <Text style={{ textAlign: 'center', marginTop: 20 }}>Chưa có dữ liệu GOAT Points</Text>;
        }
        return (
            <FlatList
                data={data}
                renderItem={({ item, index }) => (
                    <GOATPointsScoresReport
                        key={index}
                        title={item.title}
                        iconComponent={item.iconComponent}
                        selectedQuarter={selectedQuarter}
                        selectedYear={selectedYear}
                        conductScore={conductScore}
                        awarenessScore={awarenessScore}
                    />
                )}
                ListFooterComponent={() => <GOATPointsOverview />}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
            />
        )
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <LoadingScreen />
            ) : (
                <>
                    <View style={styles.headerContainer}>
                        <GOATPointsTimeScreen
                            userInfo={userInfo}
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                            selectedQuarter={selectedQuarter}
                            setSelectedQuarter={setSelectedQuarter}
                        />
                    </View>
                    {renderGOATPoints()}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffffff',
    },
    headerContainer: {
        zIndex: 9999, // Much higher zIndex to ensure dropdown is above all components
        elevation: 9999, // For Android
        position: 'relative', // Establish stacking context
    },
    flatListContent: {
        paddingBottom: 20,
    },
});