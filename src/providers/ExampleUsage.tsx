// Ví dụ về cách sử dụng database trong component

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDatabase, useDatabaseConnection } from '../providers';
import { useQuickAccess } from '../store/useQuickAccess';

export default function ExampleUsage() {
    // Cách 1: Sử dụng hook useQuickAccess (đã được tích hợp database)
    const {
        quickAccessFeatures,
        loading,
        addToQuickAccess,
        removeFromQuickAccess,
        loadQuickAccessFeatures
    } = useQuickAccess();

    // Cách 2: Sử dụng trực tiếp database connection
    const db = useDatabaseConnection();

    // Cách 3: Sử dụng database context với error handling
    const { db: database, isReady, error } = useDatabase();

    useEffect(() => {
        if (isReady) {
            loadQuickAccessFeatures();
        }
    }, [isReady]);

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Database Error: {error}</Text>
            </View>
        );
    }

    if (!isReady) {
        return (
            <View style={styles.container}>
                <Text>Loading database...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text>Database is ready!</Text>
            <Text>Quick Access Features: {quickAccessFeatures.length}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
});
