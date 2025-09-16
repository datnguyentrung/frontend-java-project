import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign'
import { red } from '@styles/colorTypes'
import { CoachAttendance } from '@/types/types';

type Props = {
    selectedDate: Date,
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
    count: number
}

export default function CoachAttendanceHeaderScreen({ selectedDate, setSelectedDate, count }: Props) {
    // Hàm giảm 1 tháng
    const decreaseMonth = () => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setSelectedDate(newDate);
    };

    // Hàm tăng 1 tháng
    const increaseMonth = () => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setSelectedDate(newDate);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={decreaseMonth}>
                <AntDesign name="left" size={25} color={red[500]} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={styles.time}>Tháng {selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}</Text>
                <View style={styles.countContainer}>
                    <Text style={styles.count}>{count}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={increaseMonth}>
                <AntDesign name="right" size={25} color={red[500]} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
    },
    time: {
        fontSize: 20,
        color: red[700],
        fontWeight: '700',
    },
    countContainer: {
        backgroundColor: red[500],
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignItems: 'center',
    },
    count: {
        textAlign: 'center',
        fontSize: 14,
        color: "#fff",
        fontWeight: '700',
        borderRadius: 20,
    },
});