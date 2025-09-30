import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

interface Option {
    icon: string;
    label: string;
    description: string;
    backgroundColor: string;
    color: string;
}

type Props = {
    option: Option;
};

export default function ProfileOptionScreen({ option }: Props) {
    return (
        <TouchableOpacity style={styles.optionContainer}>
            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: option.backgroundColor }]}>
                <Feather name={option.icon as any} size={20} color={option.color} />
            </View>

            {/* Nội dung (text + chevron) */}
            <View style={styles.contentContainer}>
                {/* Phần chữ (label + description) */}
                <View style={styles.textContainer}>
                    <Text style={styles.label}>{option.label}</Text>
                    <Text style={styles.description}>{option.description}</Text>
                </View>

                {/* Chevron (mũi tên sang phải) */}
                <View style={styles.chevronContainer}>
                    <Feather name="chevron-right" size={24} color="black" />
                </View>
            </View>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        marginLeft: 16,
    },
    textContainer: {

    },
    label: {
        fontSize: 16,
    },
    description: {
        color: '#666',
        marginTop: 3,
        fontSize: 12,
    },
    chevronContainer: {

    }
});