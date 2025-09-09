import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

// Generic pull-to-refresh hook
export const usePullToRefresh = (
    refreshCallback: () => Promise<void>,
    options?: {
        onError?: (error: any) => void;
        onSuccess?: () => void;
    }
) => {
    const [refreshing, setRefreshing] = useState(false);

    const handlePullToRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refreshCallback();
            options?.onSuccess?.();
        } catch (error) {
            console.error('❌ Pull to refresh error:', error);
            options?.onError?.(error);
        } finally {
            setRefreshing(false);
        }
    }, [refreshCallback, options]);

    return {
        refreshing,
        handlePullToRefresh,
        setRefreshing
    };
};

// Simple version for basic use cases
export const createPullToRefreshHandler = (
    refreshCallback: () => Promise<void>
) => {
    return async (setRefreshing: (value: boolean) => void) => {
        setRefreshing(true);
        try {
            await refreshCallback();
        } catch (error) {
            console.error('❌ Pull to refresh error:', error);
            Alert.alert('Lỗi', 'Không thể làm mới dữ liệu');
        } finally {
            setRefreshing(false);
        }
    };
};

// Loading state management hook
export const useLoadingState = (initialState: boolean = false) => {
    const [loading, setLoading] = useState(initialState);

    const withLoading = useCallback(async (callback: () => Promise<void>) => {
        setLoading(true);
        try {
            await callback();
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        setLoading,
        withLoading
    };
};