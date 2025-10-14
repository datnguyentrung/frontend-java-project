import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { blue, gray, green, purple, yellow, red } from '@styles/colorTypes';
import { RegistrationDTO } from '@/types/RegistrationTypes';
import taekwondo from '@assets/taekwondo.jpg';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { formatDateDMY } from '@/utils/format';

type Props = {
    item: RegistrationDTO;
    setVisible: (visible: boolean) => void;
    setSelectedItem: (item: RegistrationDTO | null) => void;
    isAttendance: boolean;
    setVisibleForm?: (visible: boolean) => void;
}

const Register = [
    { label: 'Ghi danh', color: green[500], key: 'ENROLLED', backGroundColor: green[50], textColor: green[700] },
    { label: 'Học thử', color: blue[500], key: 'TRIAL', backGroundColor: blue[50], textColor: blue[700] },
    { label: 'Đã đăng ký', color: yellow[500], key: 'REGISTERED', backGroundColor: yellow[50], textColor: yellow[700] },
    { label: 'Đã kết thúc', color: gray[500], key: 'COMPLETED', backGroundColor: gray[50], textColor: gray[700] },
]

export default function EnrollmentItemScreen({ item, setVisible, setSelectedItem, isAttendance, setVisibleForm }: Props) {
    const handlePress = () => {
        setSelectedItem(item);
        setVisible(true);
    }

    const handleOnLongPress = () => {
        setVisibleForm && setVisibleForm(true);
        setSelectedItem(item);
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={({ pressed }) => [
                    styles.headerCard,
                    pressed && styles.cardPressed, // thêm hiệu ứng khi nhấn giữ
                ]}
                    onLongPress={() => handleOnLongPress()} // Hiển thị tên khi nhấn giữ
                >
                    <Image source={taekwondo} style={styles.image} />
                    <View style={styles.headerInfo}>
                        <Text style={styles.name}>{item.personalInfo.name}</Text>
                        {/* <Text style={styles.id}>{item.idRegistration}</Text> */}
                    </View>
                </Pressable>
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: Register.find(i => i.key === item.registrationInfo.registrationStatus)?.backGroundColor,
                    borderColor: Register.find(i => i.key === item.registrationInfo.registrationStatus)?.color,
                    borderWidth: 1,
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                    borderRadius: 15,
                }}>
                    {/* Dấu chấm tròn */}
                    <View style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5, // hình tròn
                        backgroundColor: Register.find(i => i.key === item.registrationInfo.registrationStatus)?.color,
                        marginHorizontal: 5, // khoảng cách giữa chấm và text
                    }} />

                    {/* Trạng thái */}
                    <Text style={{
                        color: Register.find(i => i.key === item.registrationInfo.registrationStatus)?.textColor,
                        fontWeight: 'bold',
                        marginRight: 5,
                        fontSize: 12,
                    }}>
                        {Register.find(i => i.key === item.registrationInfo.registrationStatus)?.label}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Số điện thoại */}
                <View style={styles.contentRow}>
                    <Ionicons name="call-outline" size={24} color="black"
                        style={[styles.iconRow, {
                            backgroundColor: blue[100], color: blue[700]
                        }]}
                    />
                    <View>
                        <Text style={styles.value}>{item.personalInfo.phone}</Text>
                        <Text style={styles.key}>Số điện thoại</Text>
                    </View>
                </View>

                {/* Ngày sinh */}
                <View style={styles.contentRow}>
                    <Ionicons name="calendar-outline" size={24} color="black"
                        style={[styles.iconRow, {
                            backgroundColor: green[100], color: green[700]
                        }]}
                    />
                    <View>
                        <Text style={styles.value}>{formatDateDMY(item.personalInfo.birthDate)}</Text>
                        <Text style={styles.key}>Ngày sinh</Text>
                    </View>
                </View>

                {/* Người giới thiệu */}
                <View style={styles.contentRow}>
                    <Ionicons name="person-outline" size={24} color="black"
                        style={[styles.iconRow, {
                            backgroundColor: purple[100], color: purple[700]
                        }]}
                    />
                    <View>
                        <Text style={styles.value}>{item.personalInfo.referredBy}</Text>
                        <Text style={styles.key}>Người giới thiệu</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerRow}>
                    <View style={styles.footerContentRow}>
                        <Ionicons name="time-outline" size={20} color={gray[500]} />
                        <Text style={styles.footerText}>Đăng ký: 15/10/2025</Text>
                    </View>

                    <View style={styles.footerContentRow}>
                        <Ionicons name="school-outline" size={20} color={gray[500]} />
                        <Text style={styles.footerText}> buổi</Text>
                    </View>
                </View>

                <Pressable style={[
                    styles.footerButton,
                    isAttendance ? { backgroundColor: green[50], borderColor: green[500] }
                        : { backgroundColor: red[50], borderColor: red[600] }
                ]}
                    onPress={isAttendance ? null : handlePress}
                >
                    <Feather name={isAttendance ? "user-check" : "user-plus"} size={22} color={isAttendance ? green[700] : red[700]} />
                    <Text style={{ color: isAttendance ? green[600] : red[600], fontWeight: '500', fontSize: 18 }}>Điểm danh</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginVertical: 8,
        marginHorizontal: 20,
        // padding: 15,
        borderRadius: 20,
        elevation: 2,
    },
    headerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginVertical: 6,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3, // Android shadow
        shadowColor: '#fd7070ff', // iOS shadow
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    cardPressed: {
        backgroundColor: '#e5f1ffff', // nền đỏ nhạt khi nhấn giữ
        transform: [{ scale: 0.97 }], // hiệu ứng thu nhỏ nhẹ
    },
    header: {
        flexDirection: 'row',
        backgroundColor: gray[50],
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: gray[200],
        borderBottomWidth: 1,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        elevation: 2,
        borderColor: '#fff',
        borderWidth: 2,
    },
    headerInfo: {
        justifyContent: 'flex-start'
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    id: {
        color: gray[500],
        fontWeight: '500',
        fontSize: 10,
    },
    content: {
        marginLeft: 35,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    iconRow: {
        marginRight: 10,
        padding: 8,
        borderRadius: 13,
    },
    footer: {
        borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
        marginHorizontal: 25,
        borderTopColor: gray[200],
        borderTopWidth: 1,
    },
    value: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    key: {
        color: gray[500],
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 10,
    },
    footerText: {
        color: gray[500],
        fontSize: 13,
    },
    footerButton: {
        flexDirection: 'row',
        paddingVertical: 8,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,

        borderWidth: 2,
        borderRadius: 25,
    }
});