import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { gray, green, blue, orange } from '@styles/colorTypes';

type Props = {
    enrollCount: number;
    trialCount?: number;
    registerCount?: number;
    searchText: string;
    setSearchText: (text: string) => void;
}

const data = [
    { label: 'Ghi danh', color: green[500], key: 'enrollCount' },
    { label: 'Học thử', color: blue[500], key: 'trialCount' },
    { label: 'Đăng ký', color: orange[500], key: 'registerCount' },
]

export default function EnrollmentHeaderScreen({
    enrollCount, trialCount, registerCount, searchText, setSearchText
}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={24} color="black" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm học viên..."
                    value={searchText}
                    onChangeText={setSearchText}
                    autoCorrect={false}
                    autoCapitalize="none"
                    multiline={false}
                    numberOfLines={1}
                    defaultValue=""
                />
            </View>
            <View style={styles.itemContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.item}>
                        <Text style={{ color: item.color, fontWeight: 'bold', fontSize: 18 }}>
                            {item.key === 'enrollCount' ? enrollCount
                                : item.key === 'trialCount' ? trialCount
                                    : registerCount}
                        </Text>
                        <Text >{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: gray[50],
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 15,
        elevation: 2, // For Android shadow
    },
    searchInput: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        gap: 35,
        marginBottom: 10,
        paddingBottom: 5,
    },
    item: {
        // flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    }
});