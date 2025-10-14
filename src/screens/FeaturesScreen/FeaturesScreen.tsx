import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
    BellElectric, AlarmClockCheck,
    UserRoundPlus, UserRoundPen,
    Trophy, UserCheck, Building, Sparkles
} from 'lucide-react-native';
import FeaturesGroup from './FeaturesGroup';
import Divider from '@/components/layout/Divider';
import FeaturesHeaderScreen from '@/screens/FeaturesScreen/FeaturesHeaderScreen';
import { Feature } from "@/types/FeatureTypes";
import { useQuickAccess } from '@/store/useQuickAccess';
import { getAllFeatures } from '@/services/featureService';
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
 */
export default function FeaturesScreen() {
    const [change, setChange] = useState(false);
    const [canChange, setCanChange] = useState(false);
    const [featuresData, setFeaturesData] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { userInfo } = useAuth();

    // Fake user role - có thể thay đổi thành "Coach" hoặc "Admin" để test
    const currentUserRole = userInfo?.role;

    // Function to fetch data
    const fetchFeaturesData = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            // console.log('🔄 Fetching features data...');
            const data = await getAllFeatures();
            // console.log('✅ Features data received:', data);
            setFeaturesData(data);
        } catch (error) {
            console.error('❌ Error fetching features:', error);
            Alert.alert('Lỗi', 'Không thể tải dữ liệu tính năng. Vui lòng thử lại.');
            // Fallback to empty data if API fails
            setFeaturesData([]);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    // useFocusEffect để load data khi screen được focus
    useFocusEffect(
        useCallback(() => {
            fetchFeaturesData();
        }, [fetchFeaturesData])
    );

    // Handle pull to refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchFeaturesData(false);
        } finally {
            setRefreshing(false);
        }
    }, [fetchFeaturesData]);

    // Lọc features theo role của user hiện tại
    const filteredFeatures = currentUserRole
        ? (featuresData.filter(feature =>
            feature.roles.includes(currentUserRole) && feature.enabled))
        : [];

    // Nhóm features theo group
    const groupedFeatures = filteredFeatures.reduce((groups: { [key: string]: Feature[] }, feature) => {
        const featureGroup = feature.featureGroup;
        if (!groups[featureGroup]) {
            groups[featureGroup] = [];
        }
        groups[featureGroup].push({
            ...feature,
            iconComponent: iconMap[feature.iconComponent] || null
        });
        return groups;
    }, {});

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

    // Loading state
    if (loading) {
        return (
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <FeaturesHeaderScreen canChange={canChange} setCanChange={setCanChange} />
                <View style={[styles.featuresGroup, styles.loading]}>
                    <ActivityIndicator size="large" color="#FF5252" />
                    <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                </View>
            </ScrollView>
        );
    }

    // No data state
    if (!loading && featuresData.length === 0) {
        return (
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <FeaturesHeaderScreen canChange={canChange} setCanChange={setCanChange} />
                <View style={[styles.featuresGroup, styles.loading]}>
                    <Text style={styles.emptyText}>Không có dữ liệu features</Text>
                    <Text style={styles.emptySubText}>Kéo xuống để làm mới</Text>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <FeaturesHeaderScreen canChange={canChange} setCanChange={setCanChange} />
            <ScrollView style={styles.featuresGroup}>
                <FeaturesGroup
                    title="quickAccess"
                    features={
                        quickAccessFeatures.map(feature => ({
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