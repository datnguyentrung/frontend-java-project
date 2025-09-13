import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GOATPointsOverview() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Tổng quan GOAT Points</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.description}>GOAT Points Overview Screen</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        backgroundColor: '#4CAF50',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    content: {
        padding: 16,
        minHeight: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});