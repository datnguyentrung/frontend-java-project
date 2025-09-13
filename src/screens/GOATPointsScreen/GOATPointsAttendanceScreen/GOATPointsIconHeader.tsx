import React, { ComponentProps } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScoreDataType } from '@/types/types';
import { navigateToFeature } from '@/navigation/FeatureNavigator';

type FontAwesome5IconName = ComponentProps<typeof FontAwesome5>['name'];

type dataProps = {
    name: FontAwesome5IconName,
    key: string,
}

type RouteParams = {
    scoreData?: ScoreDataType
    title?: string
}

const data: dataProps[] = [
    { name: 'chart-bar', key: 'Điểm Rèn Luyện' },
    { name: 'heart', key: 'Điểm Ý Thức' },
]

export default function GOATPointsIconHeader() {
    const navigation = useNavigation();
    const route = useRoute();
    const { scoreData, title } = (route.params as RouteParams) || {};

    const [selectedTab, setSelectedTab] = React.useState(title || 'Điểm Rèn Luyện');


    // console.log('Score data in header:', scoreData);

    // Hàm xử lý khi nhấn button
    const handleButtonPress = (buttonName: string) => {
        console.log('🚀 Feature pressed:', buttonName);

        // Xác định điểm số tương ứng với loại title
        let data: ScoreDataType | null = null;

        if (
            (buttonName === "Điểm Rèn Luyện" && scoreData?.conductScore) ||
            (buttonName === "Điểm Ý Thức" && scoreData?.awarenessScore)
        ) {
            data = {
                type: buttonName,
                conductScore: scoreData?.conductScore,
                awarenessScore: scoreData?.awarenessScore,
                quarter: scoreData?.quarter,
                year: scoreData?.year,
                listAttendance: scoreData?.listAttendance,
            };
            setSelectedTab(buttonName);
        }

        // Sử dụng navigation helper từ FeatureNavigator
        const success = navigateToFeature("Điểm điểm danh", navigation, data);

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 18 }}>
            {data.map((item) => (
                <Pressable key={item.name}
                    onPress={() => handleButtonPress(item.key)}
                    style={[
                        styles.iconContainer,
                        { backgroundColor: item.key === selectedTab ? 'white' : 'transparent' }
                    ]}>
                    <FontAwesome5
                        name={item.name}
                        size={24}
                        color={item.key === selectedTab ? 'red' : 'white'}
                    />
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
});