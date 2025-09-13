import React from 'react';
import { View } from 'react-native';
import GOATPointsAwarenessScreen from './GOATPointsAwarenessScreen/GOATPointsAwarenessScreen';
import GOATPointsConductScreen from './GOATPointsConductScreen/GOATPointsConductScreen';
import { ScoreDataType } from '@/types/types';
import { RouteProp, useRoute } from '@react-navigation/native';

type RouteParams = {
    title?: string;
    scoreData?: ScoreDataType;
};


export default function GOATPointsAttendanceScreen() {
    const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
    const { scoreData } = route.params || {};

    // console.log(scoreData);

    return (
        <View style={{ flex: 1 }}>
            {scoreData?.type === 'Điểm Ý Thức' && <GOATPointsAwarenessScreen scoreData={scoreData} />}
            {scoreData?.type === 'Điểm Rèn Luyện' && <GOATPointsConductScreen scoreData={scoreData} />}
        </View>
    );
}