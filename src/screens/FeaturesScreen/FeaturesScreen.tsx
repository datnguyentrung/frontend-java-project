import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import {
    BellElectric, AlarmClockCheck,
    UserRoundPlus, UserRoundPen,
    Trophy, UserCheck, Building, Sparkles,
    RefreshCw, AlertTriangle
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
    const [isRetrying, setIsRetrying] = useState(false);
    const { userInfo } = useAuth();

    // Lấy user role hiện tại
    const currentUserRole = userInfo?.role;

    // Sử dụng custom hook để lấy features với caching
    const {
        data: featuresData,
        groupedFeatures: rawGroupedFeatures,
        isLoading: loading,
        error,
        refetch
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
                originalIconComponent: feature.basicInfo.iconComponent, // Lưu string gốc
                iconComponent: iconMap[feature.basicInfo.iconComponent] || null // React component
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

    // Handle retry function
    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            await refetch();
        } catch (err) {
            console.error('Retry failed:', err);
        } finally {
            setIsRetrying(false);
        }
    };

    // Error state
    if (error) {
        return (
            <ScrollView style={styles.container}>
                <FeaturesHeaderScreen canChange={canChange} setCanChange={setCanChange} />
                <View style={[styles.featuresGroup, styles.errorContainer]}>
                    <View style={styles.errorIconContainer}>
                        <AlertTriangle size={64} color="#FF5252" />
                    </View>

                    <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
                    <Text style={styles.errorSubText}>
                        Không thể tải dữ liệu tính năng. Vui lòng kiểm tra kết nối mạng và thử lại.
                    </Text>

                    <TouchableOpacity
                        style={[styles.retryButton, isRetrying && styles.retryButtonDisabled]}
                        onPress={handleRetry}
                        disabled={isRetrying}
                        activeOpacity={0.8}
                    >
                        {isRetrying ? (
                            <>
                                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                                <Text style={styles.retryButtonText}>Đang thử lại...</Text>
                            </>
                        ) : (
                            <>
                                <RefreshCw size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                <Text style={styles.retryButtonText}>Thử lại</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.errorHelpText}>
                        Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ bộ phận hỗ trợ.
                    </Text>
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
                            iconComponent: iconMap[feature.basicInfo.iconComponent] || null
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 24,
    },
    errorIconContainer: {
        marginBottom: 24,
        padding: 16,
        borderRadius: 50,
        backgroundColor: '#FFF5F5',
        borderWidth: 2,
        borderColor: '#FFEBEE',
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FF5252',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    errorSubText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF5252',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 20,
        minWidth: 140,
        shadowColor: '#FF5252',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    retryButtonDisabled: {
        backgroundColor: '#FFB3BA',
        shadowOpacity: 0.1,
        elevation: 2,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    errorHelpText: {
        fontSize: 13,
        color: '#999',
        textAlign: 'center',
        lineHeight: 18,
        fontStyle: 'italic',
        paddingHorizontal: 16,
    },
});