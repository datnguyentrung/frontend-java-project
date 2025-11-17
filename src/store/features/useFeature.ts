import React from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Feature } from '@/types/FeatureTypes';
import { useDatabaseConnection, useDatabase } from '@/providers';
import {
    migrateFeatureDb, insertFeature, updateFeature,
    deleteFeatures, getAllFeaturesFromLocalStorage, getFeatureByIdFeature,
    getFeatureByRole, clearFeature
} from './featureDb';
import { getAllFeatures as getAllFeaturesFromAPI } from '@/services/featureService';

// Query keys để cache management
const QUERY_KEYS = {
    features: ['features'] as const,
    featureDetail: (id: string) => ['features', 'detail', id] as const,
    featuresByRole: (role: string) => ['features', 'byRole', role] as const,
};

// Hook để lấy tất cả features
export const useFeatures = () => {
    const { isReady, db } = useDatabase();

    return useQuery({
        queryKey: QUERY_KEYS.features,
        queryFn: async () => {
            if (!db) throw new Error('Database not available');

            console.log('🔍 Checking local features...');
            // Kiểm tra local database trước
            const localFeatures = await getAllFeaturesFromLocalStorage(db);

            if (localFeatures.length > 0) {
                console.log('✅ Found', localFeatures.length, 'features in local storage');
                return localFeatures;
            }

            console.log('📡 Local storage empty, fetching from API...');
            // Nếu local trống, gọi API
            const apiFeatures = await getAllFeaturesFromAPI();

            console.log('✅ Received', apiFeatures.length, 'features from API');
            // Lưu vào local storage
            for (const feature of apiFeatures) {
                await insertFeature(db, feature);
            }

            console.log('💾 Saved features to local storage');
            return apiFeatures;
        },
        enabled: !!db && isReady,
        staleTime: 30 * 60 * 1000, // 30 minutes - longer since we have local cache
        gcTime: 60 * 60 * 1000, // 1 hour
    });
};

// Hook để lấy feature theo ID
export const useFeatureDetail = (idFeature: string) => {
    const { isReady, db } = useDatabase();

    return useQuery({
        queryKey: QUERY_KEYS.featureDetail(idFeature),
        queryFn: async () => {
            if (!db) throw new Error('Database not available');
            return await getFeatureByIdFeature(db, idFeature);
        },
        enabled: !!db && !!idFeature && isReady,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

// Hook để lấy features theo role
export const useFeaturesByRole = (userRole: string) => {
    const { isReady, db } = useDatabase();

    return useQuery({
        queryKey: QUERY_KEYS.featuresByRole(userRole),
        queryFn: async () => {
            if (!db) throw new Error('Database not available');

            console.log('🔍 Checking local features for role:', userRole);
            // Kiểm tra local database trước
            const localFeatures = await getAllFeaturesFromLocalStorage(db);

            if (localFeatures.length > 0) {
                console.log('✅ Found', localFeatures.length, 'features in local, filtering by role');
                // Filter theo role và enabled status
                return localFeatures.filter(feature =>
                    feature.basicInfo.enabled && feature.basicInfo.roles.includes(userRole)
                );
            }

            console.log('📡 Local storage empty, fetching from API...');
            // Nếu local trống, gọi API và lưu
            const apiFeatures = await getAllFeaturesFromAPI();

            console.log('✅ Received', apiFeatures.length, 'features from API');
            // Lưu vào local storage
            for (const feature of apiFeatures) {
                await insertFeature(db, feature);
            }

            console.log('💾 Saved features to local storage');
            // Return filtered features
            return apiFeatures.filter((feature: Feature) =>
                feature.basicInfo.enabled && feature.basicInfo.roles.includes(userRole)
            );
        },
        enabled: !!db && !!userRole && isReady,
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
    });
};

// Hook để thêm feature mới
export const useCreateFeature = () => {
    const { db } = useDatabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (feature: Feature) => {
            if (!db) throw new Error('Database not available');
            const success = await insertFeature(db, feature);
            if (!success) throw new Error('Failed to create feature');
            return feature;
        },
        onSuccess: () => {
            // Invalidate và refetch tất cả queries liên quan
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.features });
        },
        onError: (error) => {
            console.error('Error creating feature:', error);
        },
    });
};

// Hook để cập nhật feature
export const useUpdateFeature = () => {
    const { db } = useDatabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ idFeature, updates }: { idFeature: string; updates: Partial<Feature> }) => {
            if (!db) throw new Error('Database not available');
            const success = await updateFeature(db, idFeature, updates);
            if (!success) throw new Error('Failed to update feature');
            return { idFeature, updates };
        },
        onSuccess: ({ idFeature }) => {
            // Invalidate specific feature và all features
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.featureDetail(idFeature) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.features });
        },
        onError: (error) => {
            console.error('Error updating feature:', error);
        },
    });
};

// Hook để xóa feature
export const useDeleteFeature = () => {
    const { db } = useDatabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (idFeature: string) => {
            if (!db) throw new Error('Database not available');
            const success = await deleteFeatures(db, idFeature);
            if (!success) throw new Error('Failed to delete feature');
            return idFeature;
        },
        onSuccess: (idFeature) => {
            // Remove specific feature from cache và invalidate all features
            queryClient.removeQueries({ queryKey: QUERY_KEYS.featureDetail(idFeature) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.features });
        },
        onError: (error) => {
            console.error('Error deleting feature:', error);
        },
    });
};

// Hook để clear tất cả features
export const useClearFeatures = () => {
    const { db } = useDatabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!db) throw new Error('Database not available');
            const success = await clearFeature(db);
            if (!success) throw new Error('Failed to clear features');
            return true;
        },
        onSuccess: () => {
            // Clear tất cả feature-related cache
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.features });
            queryClient.removeQueries({ queryKey: ['features'] });
        },
        onError: (error) => {
            console.error('Error clearing features:', error);
        },
    });
};

// Hook để migrate database (thường dùng khi app khởi động)
export const useMigrateFeatures = () => {
    const { db } = useDatabase();

    return useMutation({
        mutationFn: async () => {
            if (!db) throw new Error('Database not available');
            await migrateFeatureDb(db);
            return true;
        },
        onError: (error) => {
            console.error('Error migrating features database:', error);
        },
    });
};



// Helper hook để check feature có enabled và user có quyền không
export const useCanAccessFeature = (idFeature: string, userRole: string) => {
    const { data: feature, isLoading } = useFeatureDetail(idFeature);

    const canAccess = React.useMemo(() => {
        if (!feature) return false;
        return feature.basicInfo.enabled && feature.basicInfo.roles.includes(userRole);
    }, [feature, userRole]);

    return {
        canAccess,
        isLoading,
        feature,
    };
};

// Hook để lấy features grouped by featureGroup
export const useGroupedFeatures = (userRole?: string) => {
    const { data: features, ...queryResult } = userRole
        ? useFeaturesByRole(userRole)
        : useFeatures();

    const groupedFeatures = React.useMemo(() => {
        if (!features) return {};

        return features.reduce((groups: { [key: string]: Feature[] }, feature: Feature) => {
            const group = feature.basicInfo.featureGroup;
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(feature);
            return groups;
        }, {});
    }, [features]);

    return {
        ...queryResult,
        data: features,
        groupedFeatures,
    };
};