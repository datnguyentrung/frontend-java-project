import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CoachAttendance } from '@/types/types';
import taekwondo from '@assets/taekwondo.jpg';
import { formatDateDM, formatTimeHM } from '@/utils/format';
import Feather from '@expo/vector-icons/Feather'

export default function CoachAttendanceItemScreen({ attendance }: { attendance: CoachAttendance }) {
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <View>
                    <Image source={taekwondo} style={{ width: 50, height: 50, borderRadius: 25 }} />
                </View>
                <View style={{ gap: 3 }}>
                    <Text style={{ fontWeight: 'bold' }}>{attendance.coachName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, }}>
                        <Feather name="clock" size={14} color="gray" />
                        <Text style={{ color: 'gray' }}>{formatDateDM(attendance.datetime)} • {formatTimeHM(attendance.datetime)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, }}>
                        <Feather name="map-pin" size={14} color="gray" />
                        <Text style={{ color: 'gray' }}>{attendance.classSession.branch.title}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.points}>
                <Text>+15đ</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        marginVertical: 8,
        marginHorizontal: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        elevation: 2,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    points: {
        alignItems: 'center',
    }
});