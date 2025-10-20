import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import {
    BellElectric, AlarmClockCheck,
    UserRoundPlus, UserRoundPen,
    Trophy, UserCheck, Building, Sparkles
} from 'lucide-react-native';
import FeaturesGroup from './FeaturesGroup';
import Divider from '@/components/layout/Divider';
import FeaturesHeaderScreen from '@/screens/FeaturesScreen/FeaturesHeaderScreen';
import { Feature } from "@/types/FeatureTypes";
import { useQuickAccess } from '@/store/quickAccess/useQuickAccess';
import { useGroupedFeatures } from '@/store/features/useFeature';
import { useAuth } from "@/providers/AuthProvider";

// Icon mapping để chuyển đổi từ string sang component
const iconMap: { [key: string]: any } = {
    Trophy: Trophy,
    UserCheck: UserCheck,
    AlarmClockCheck: AlarmClockCheck,
    BellElectric: BellElectric,
    UserRoundPlus: UserRoundPlus,
    Building: Building,
    Sparkles: Sparkles,
    UserRoundPen: UserRoundPen
};

/**
 * FeaturesScreen - Màn hình tính năng
 * Hiển thị các tính năng dựa trên role của người dùng
 * Sử dụng custom hook với caching để tối ưu performance
 */
export default function FeaturesScreen() {
    const [change, setChange] = useState(false);
    const [canChange, setCanChange] = useState(false);
    const { userInfo } = useAuth();

    // Lấy user role hiện tại
    const currentUserRole = userInfo?.role;

    // Sử dụng custom hook để lấy features với caching
    const {
        data: featuresData,
        groupedFeatures: rawGroupedFeatures,
        isLoading: loading,
        error
    } = useGroupedFeatures(currentUserRole);

    // Debug logging
    React.useEffect(() => {
        console.log('🎯 FeaturesScreen - Current user role:', currentUserRole);
        console.log('📊 FeaturesScreen - Features data:', featuresData?.length || 0, 'items');
        console.log('📦 FeaturesScreen - Grouped features:', Object.keys(rawGroupedFeatures || {}).length, 'groups');
        console.log('⏳ FeaturesScreen - Loading:', loading);
        if (error) console.log('❌ FeaturesScreen - Error:', error);
    }, [currentUserRole, featuresData, rawGroupedFeatures, loading, error]);

    // Xử lý icon mapping với useMemo để tối ưu performance
    const groupedFeatures = React.useMemo(() => {
        if (!rawGroupedFeatures) return {};

        const result: { [key: string]: Feature[] } = {};
        Object.entries(rawGroupedFeatures).forEach(([groupName, features]) => {
            // Type assertion để fix TypeScript error
            const typedFeatures = features as Feature[];
            result[groupName] = typedFeatures.map((feature: Feature) => ({
                ...feature,
                iconComponent: iconMap[feature.iconComponent] || null
            }));
        });
        return result;
    }, [rawGroupedFeatures]);

    // console.log(groupedFeatures);

    // Tạo mảng featureGroups để render
    const featureGroups = Object.entries(groupedFeatures).map(([groupFeature, features]) => ({
        // id: groupFeature,
        // title: groupFeature,
        title: groupFeature,
        features: features
    }));

    // console.log('Feature Groups:', featureGroups);

    const {
        quickAccessFeatures
    } = useQuickAccess();

    // Error state
    if (error) {
        return (
            <ScrollView style={styles.container}>
                <FeaturesHeaderScreen canChange={canChange} setCanChange={setCanChange} />
                <View style={[styles.featuresGroup, styles.loading]}>
                    <Text style={styles.emptyText}>Có lỗi xảy ra khi tải dữ liệu</Text>
                    <Text style={styles.emptySubText}>Vui lòng thử lại sau</Text>
                </View>
            </ScrollView>
        );
    }

    // Loading state
    if (loading) {
        return (
            <ScrollView style={styles.container}>
                <FeaturesHeaderScreen canChange={canChange} setCanChange={setCanChange} />
                <View style={[styles.featuresGroup, styles.loading]}>
                    <ActivityIndicator size="large" color="#FF5252" />
                    <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                </View>
            </ScrollView>
        );
    }

    // No data state
    if (!loading && (!featuresData || featuresData.length === 0)) {
        return (
            <ScrollView style={styles.container}>
                <FeaturesHeaderScreen canChange={canChange} setCanChange={setCanChange} />
                <View style={[styles.featuresGroup, styles.loading]}>
                    <Text style={styles.emptyText}>Không có dữ liệu features</Text>
                    <Text style={styles.emptySubText}>Vui lòng kiểm tra lại</Text>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <FeaturesHeaderScreen canChange={canChange} setCanChange={setCanChange} />
            <ScrollView style={styles.featuresGroup}>
                <FeaturesGroup
                    title="quickAccess"
                    features={
                        quickAccessFeatures.map((feature: Feature) => ({
                            ...feature,
                            iconComponent: iconMap[feature.iconComponent] || null
                        }))
                    }
                    change={change}
                    setChange={setChange}
                    canChange={canChange}
                />
                {featureGroups.map((group, index) => (
                    <View key={index}>
                        <Divider />
                        <FeaturesGroup
                            title={group.title}
                            features={group.features}
                            change={change}
                            setChange={setChange}
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
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '500',
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});