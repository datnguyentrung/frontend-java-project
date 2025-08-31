import { useState, useEffect } from 'react';
import { Feature } from './types';
import { useDatabaseConnection } from '../providers';
import {
    insertQuickAccessFeature,
    deleteQuickAccessFeature,
    getQuickAccessFeatures,
    isFeatureInQuickAccess,
    updateQuickAccessFeature,
    clearQuickAccess
} from './quickAccessDb';

export const useQuickAccess = () => {
    const db = useDatabaseConnection(); // Lấy database từ provider
    const [quickAccessFeatures, setQuickAccessFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(false);

    // Load quick access features from database
    const loadQuickAccessFeatures = async () => {
        setLoading(true);
        try {
            const features = await getQuickAccessFeatures(db);
            setQuickAccessFeatures(features);
        } catch (error) {
            console.error('Error loading quick access features:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add feature to quick access
    const addToQuickAccess = async (feature: Feature) => {
        setLoading(true);
        try {
            const isAlreadyAdded = await isFeatureInQuickAccess(db, feature.id_feature);
            if (isAlreadyAdded) {
                console.log('Feature already in quick access');
                return false;
            }

            const success = await insertQuickAccessFeature(db, feature);
            if (success) {
                await loadQuickAccessFeatures(); // Reload data
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding to quick access:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Remove feature from quick access
    const removeFromQuickAccess = async (id_feature: number) => {
        setLoading(true);
        try {
            const success = await deleteQuickAccessFeature(db, id_feature);
            if (success) {
                await loadQuickAccessFeatures(); // Reload data
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error removing from quick access:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Check if feature is in quick access
    const checkIfInQuickAccess = async (id_feature: number) => {
        try {
            return await isFeatureInQuickAccess(db, id_feature);
        } catch (error) {
            console.error('Error checking quick access:', error);
            return false;
        }
    };

    // Update feature in quick access
    const updateQuickAccess = async (id_feature: number, updates: Partial<Feature>) => {
        setLoading(true);
        try {
            const success = await updateQuickAccessFeature(db, id_feature, updates);
            if (success) {
                await loadQuickAccessFeatures(); // Reload data
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating quick access:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Clear all quick access
    const clearAllQuickAccess = async () => {
        setLoading(true);
        try {
            const success = await clearQuickAccess(db);
            if (success) {
                setQuickAccessFeatures([]);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error clearing quick access:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Load features on mount
    useEffect(() => {
        loadQuickAccessFeatures();
    }, []);

    return {
        quickAccessFeatures,
        loading,
        addToQuickAccess,
        removeFromQuickAccess,
        checkIfInQuickAccess,
        updateQuickAccess,
        clearAllQuickAccess,
        loadQuickAccessFeatures
    };
};
