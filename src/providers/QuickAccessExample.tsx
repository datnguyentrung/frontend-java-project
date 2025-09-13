// Example về cách sử dụng useQuickAccess với React Query

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useQuickAccess } from '../store/useQuickAccess';
import { Feature } from '../types/types';

// Mock feature data
const mockFeature: Feature = {
    feature_id: 999,
    title: 'Test Feature',
    feature_group: 'Test Group',
    role: ['Student'],
    is_active: true,
    icon: 'Zap'
};

export default function QuickAccessExample() {
    const {
        // Data và loading states
        quickAccessFeatures,
        loading,
        error,

        // Functions
        addToQuickAccess,
        removeFromQuickAccess,
        clearAllQuickAccess,

        // Mutation states
        isAdding,
        isRemoving,
        isClearing,

        // Hook để check feature
        useCheckFeatureInQuickAccess,
    } = useQuickAccess();

    // Example sử dụng hook check feature
    const { data: isInQuickAccess } = useCheckFeatureInQuickAccess(999);

    const handleAdd = async () => {
        const success = await addToQuickAccess(mockFeature);
        console.log('Add result:', success);
    };

    const handleRemove = async (feature_id: number) => {
        const success = await removeFromQuickAccess(feature_id);
        console.log('Remove result:', success);
    };

    const handleClearAll = async () => {
        const success = await clearAllQuickAccess();
        console.log('Clear all result:', success);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading quick access features...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>Error: {error.message}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quick Access Features ({quickAccessFeatures.length})</Text>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.addButton]}
                    onPress={handleAdd}
                    disabled={isAdding}
                >
                    <Text style={styles.buttonText}>
                        {isAdding ? 'Adding...' : 'Add Test Feature'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.clearButton]}
                    onPress={handleClearAll}
                    disabled={isClearing}
                >
                    <Text style={styles.buttonText}>
                        {isClearing ? 'Clearing...' : 'Clear All'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Feature Status */}
            <Text style={styles.status}>
                Test Feature is {isInQuickAccess ? 'IN' : 'NOT IN'} quick access
            </Text>

            {/* Features List */}
            <FlatList
                data={quickAccessFeatures}
                keyExtractor={(item) => item.feature_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.featureItem}>
                        <View style={styles.featureInfo}>
                            <Text style={styles.featureTitle}>{item.title}</Text>
                            <Text style={styles.featureGroup}>{item.feature_group}</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.button, styles.removeButton]}
                            onPress={() => handleRemove(item.feature_id)}
                            disabled={isRemoving}
                        >
                            <Text style={styles.buttonText}>
                                {isRemoving ? '...' : 'Remove'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No quick access features</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
    },
    addButton: {
        backgroundColor: '#4CAF50',
    },
    removeButton: {
        backgroundColor: '#f44336',
        flex: 0,
        paddingHorizontal: 16,
    },
    clearButton: {
        backgroundColor: '#ff9800',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    status: {
        fontSize: 16,
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        textAlign: 'center',
    },
    featureItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 8,
    },
    featureInfo: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    featureGroup: {
        fontSize: 14,
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontStyle: 'italic',
        marginTop: 32,
    },
    error: {
        color: '#f44336',
        textAlign: 'center',
    },
});
