import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Feature } from '../types/types';
import { useDatabaseConnection } from '../providers';
import {
    insertQuickAccessFeature,
    deleteQuickAccessFeature,
    getQuickAccessFeatures,
    isFeatureInQuickAccess,
    updateQuickAccessFeature,
    clearQuickAccess
} from './quickAccessDb';

// Query keys để cache management
const QUERY_KEYS = {
    quickAccess: ['quickAccess'] as const,
    checkFeature: (id: number) => ['quickAccess', 'check', id] as const,
};

export const useQuickAccess = () => {
    const db = useDatabaseConnection();
    const queryClient = useQueryClient();

    // ✅ UseQuery để load quick access features
    const {
        data: quickAccessFeatures = [],
        isLoading: loading,
        error,
        refetch: loadQuickAccessFeatures
    } = useQuery({
        queryKey: QUERY_KEYS.quickAccess,
        queryFn: async () => {
            const features = await getQuickAccessFeatures(db);
            console.log('Loaded quick access features:', features.map(f => f.title));
            return features;
        },
        enabled: !!db, // Chỉ chạy khi db đã sẵn sàng
        staleTime: 1000 * 60 * 5, // 5 phút
        gcTime: 1000 * 60 * 10, // 10 phút (cacheTime deprecated)
    });

    // ✅ Mutation để thêm feature vào quick access
    const addToQuickAccessMutation = useMutation({
        mutationFn: async (feature: Feature) => {
            const isAlreadyAdded = await isFeatureInQuickAccess(db, feature.feature_id);
            if (isAlreadyAdded) {
                console.log('Feature already in quick access');
                throw new Error('Feature already in quick access');
            }

            const success = await insertQuickAccessFeature(db, feature);
            if (!success) {
                throw new Error('Failed to insert feature');
            }
            return feature;
        },
        onSuccess: () => {
            // Invalidate và refetch quick access data
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.quickAccess });
            console.log('Feature added to quick access successfully');
        },
        onError: (error) => {
            console.error('Error adding to quick access:', error);
        }
    });

    // ✅ Mutation để xóa feature khỏi quick access
    const removeFromQuickAccessMutation = useMutation({
        mutationFn: async (feature_id: number) => {
            const success = await deleteQuickAccessFeature(db, feature_id);
            if (!success) {
                throw new Error('Failed to remove feature');
            }
            return feature_id;
        },
        onSuccess: (feature_id) => {
            // Invalidate và refetch quick access data
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.quickAccess });
            console.log('Feature removed from quick access:', feature_id);
        },
        onError: (error) => {
            console.error('Error removing from quick access:', error);
        }
    });

    // ✅ Mutation để update feature trong quick access
    const updateQuickAccessMutation = useMutation({
        mutationFn: async ({ feature_id, updates }: { feature_id: number; updates: Partial<Feature> }) => {
            const success = await updateQuickAccessFeature(db, feature_id, updates);
            if (!success) {
                throw new Error('Failed to update feature');
            }
            return { feature_id, updates };
        },
        onSuccess: () => {
            // Invalidate và refetch quick access data
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.quickAccess });
        },
        onError: (error) => {
            console.error('Error updating quick access:', error);
        }
    });

    // ✅ Mutation để clear all quick access
    const clearAllQuickAccessMutation = useMutation({
        mutationFn: async () => {
            const success = await clearQuickAccess(db);
            if (!success) {
                throw new Error('Failed to clear quick access');
            }
        },
        onSuccess: () => {
            // Invalidate và refetch quick access data
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.quickAccess });
        },
        onError: (error) => {
            console.error('Error clearing quick access:', error);
        }
    });

    // ✅ Hook để check feature có trong quick access không
    const useCheckFeatureInQuickAccess = (feature_id: number) => {
        return useQuery({
            queryKey: QUERY_KEYS.checkFeature(feature_id),
            queryFn: async () => {
                return await isFeatureInQuickAccess(db, feature_id);
            },
            enabled: !!db && !!feature_id,
            staleTime: 1000 * 60 * 2, // 2 phút
        });
    };

    // ✅ Wrapper functions để dễ sử dụng
    const addToQuickAccess = async (feature: Feature) => {
        try {
            await addToQuickAccessMutation.mutateAsync(feature);
            return true;
        } catch (error) {
            return false;
        }
    };

    const removeFromQuickAccess = async (feature_id: number) => {
        try {
            await removeFromQuickAccessMutation.mutateAsync(feature_id);
            return true;
        } catch (error) {
            return false;
        }
    };

    const updateQuickAccess = async (feature_id: number, updates: Partial<Feature>) => {
        try {
            await updateQuickAccessMutation.mutateAsync({ feature_id, updates });
            return true;
        } catch (error) {
            return false;
        }
    };

    const clearAllQuickAccess = async () => {
        try {
            await clearAllQuickAccessMutation.mutateAsync();
            return true;
        } catch (error) {
            return false;
        }
    };

    const checkIfInQuickAccess = async (feature_id: number) => {
        try {
            return await isFeatureInQuickAccess(db, feature_id);
        } catch (error) {
            console.error('Error checking quick access:', error);
            return false;
        }
    };

    return {
        // Data và loading states
        quickAccessFeatures,
        loading: loading ||
            addToQuickAccessMutation.isPending ||
            removeFromQuickAccessMutation.isPending ||
            updateQuickAccessMutation.isPending ||
            clearAllQuickAccessMutation.isPending,
        error,

        // Functions
        addToQuickAccess,
        removeFromQuickAccess,
        updateQuickAccess,
        clearAllQuickAccess,
        checkIfInQuickAccess,
        loadQuickAccessFeatures,

        // Mutation states để UI có thể sử dụng
        isAdding: addToQuickAccessMutation.isPending,
        isRemoving: removeFromQuickAccessMutation.isPending,
        isUpdating: updateQuickAccessMutation.isPending,
        isClearing: clearAllQuickAccessMutation.isPending,

        // Hook để check feature
        useCheckFeatureInQuickAccess,
    };
};
