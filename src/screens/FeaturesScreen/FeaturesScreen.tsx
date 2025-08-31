import React, { useState, useEffect, act } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import {
    GraduationCap, BellElectric, AlarmClockCheck,
    UserRoundPlus, Users, Settings, Calendar, Zap
} from 'lucide-react-native';
import FeaturesGroup from './FeaturesGroup';
import Divider from '@/components/layout/Divider';
import FeaturesHeaderScreen from '@/screens/FeaturesScreen/FeaturesHeaderScreen';
import { Feature } from "@/store/types";
// Import để sử dụng database trong tương lai
// import { useQuickAccess } from '@/store/useQuickAccess';
// import { useDatabase } from '@/providers';

const FeaturesData: Feature[] = [
    {
        id_feature: 1,
        title: "GOAT points",
        group: "Bảng xếp hạng",
        role: ["Coach", "Student", "Admin"],
        is_active: true,
        icon: "Zap",
    },
    {
        id_feature: 2,
        title: "Thời gian rèn luyện",
        group: "Bảng xếp hạng",
        role: ["Coach", "Student", "Admin"],
        is_active: true,
        icon: "Zap",
    },
    {
        id_feature: 3,
        title: "Kỹ năng",
        group: "Bảng xếp hạng",
        role: ["Coach", "Student", "Admin"],
        is_active: true,
        icon: "Zap",
    },
    {
        id_feature: 4,
        title: "Thống kê",
        group: "Bảng xếp hạng",
        role: ["Coach", "Student", "Admin"],
        is_active: true,
        icon: "Zap",
    },
    {
        id_feature: 5,
        title: "Tính năng khác",
        group: "Bảng xếp hạng",
        role: ["Coach", "Student", "Admin"],
        is_active: true,
        icon: "Zap",
    },
    {
        id_feature: 6,
        title: "Rèn luyện",
        group: "Học tập",
        role: ["Student"],
        is_active: true,
        icon: "GraduationCap",
    },
    {
        id_feature: 7,
        title: "Lịch học",
        group: "Học tập",
        role: ["Student"],
        is_active: true,
        icon: "Calendar",
    },
    {
        id_feature: 8,
        title: "Điểm danh HLV",
        group: "Huấn luyện viên",
        role: ["Coach"],
        is_active: true,
        icon: "AlarmClockCheck",
    },
    {
        id_feature: 9,
        title: "Nghỉ phép",
        group: "Huấn luyện viên",
        role: ["Coach"],
        is_active: true,
        icon: "BellElectric",
    },
    {
        id_feature: 10,
        title: "Điểm danh HV",
        group: "Quản lý lớp học",
        role: ["Coach"],
        is_active: true,
        icon: "BellElectric",
    },
    {
        id_feature: 11,
        title: "Ghi danh",
        group: "Học viên mới",
        role: ["Coach"],
        is_active: true,
        icon: "UserRoundPlus",
    },
    {
        id_feature: 12,
        title: "Điểm danh tập thử",
        group: "Học viên mới",
        role: ["Coach"],
        is_active: true,
        icon: "BellElectric",
    },
];

// Định nghĩa type cho feature có iconComponent
interface FeatureWithIcon extends Feature {
    iconComponent: any;
}

// Icon mapping để chuyển đổi từ string sang component
const iconMap: { [key: string]: any } = {
    Zap: Zap,
    GraduationCap: GraduationCap,
    Calendar: Calendar,
    AlarmClockCheck: AlarmClockCheck,
    BellElectric: BellElectric,
    UserRoundPlus: UserRoundPlus,
    Users: Users,
    Settings: Settings,
};

/**
 * FeaturesScreen - Màn hình tính năng
 * Hiển thị các tính năng dựa trên role của người dùng
 */
export default function FeaturesScreen() {
    const [featuresQuickAccess, setFeaturesQuickAccess] = useState<FeatureWithIcon[]>([]);
    const [change, setChange] = useState(false);
    const [canChange, setCanChange] = useState(false);

    // Fake user role - có thể thay đổi thành "Coach" hoặc "Admin" để test
    const currentUserRole = "Student";

    const handleAddQuickAccess = (feature: FeatureWithIcon) => {
        // Kiểm tra xem feature đã có trong quick access chưa
        const isAlreadyAdded = featuresQuickAccess.some(f => f.id_feature === feature.id_feature);
        if (!isAlreadyAdded) {
            setFeaturesQuickAccess((prev) => [...prev, feature]);
            console.log('Feature added to quick access:', feature);
            setChange(true);
        }
    };

    // Lọc features theo role của user hiện tại
    const filteredFeatures = FeaturesData.filter(feature =>
        feature.role.includes(currentUserRole) && feature.is_active
    );

    // Nhóm features theo group
    const groupedFeatures = filteredFeatures.reduce((groups: { [key: string]: FeatureWithIcon[] }, feature) => {
        const group = feature.group;
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push({
            ...feature,
            iconComponent: iconMap[feature.icon]
        });
        return groups;
    }, {});

    // Tạo mảng featureGroups để render
    const featureGroups = [
        {
            id: 'quick',
            title: 'quickAccess',
            features: featuresQuickAccess
        },
        ...Object.entries(groupedFeatures).map(([groupName, features]) => ({
            id: groupName,
            title: groupName,
            features: features
        }))
    ];

    return (
        <ScrollView style={styles.container}>
            {/* <View> */}
            <FeaturesHeaderScreen canChange={canChange} setCanChange={setCanChange} />
            {/* </View> */}
            <ScrollView style={styles.featuresGroup}>
                {featureGroups.map((group, index) => (
                    <View key={index}>
                        {group.title !== 'quickAccess' && <Divider />}
                        <FeaturesGroup
                            title={group.title}
                            features={group.features}
                            change={change}
                            setChange={setChange}
                            handleAddQuickAccess={handleAddQuickAccess}
                            canChange={canChange}
                        />
                    </View>
                ))}
            </ScrollView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    featuresGroup: {
        padding: 15,
    },
});