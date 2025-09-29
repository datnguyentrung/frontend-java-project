import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';

const { width } = Dimensions.get('window');

interface Student {
    id: number;
    name: string;
    status: string;
}

export default function LeaveRequestScreen() {
    const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const students: Student[] = [
        { id: 1, name: 'Nguyễn Văn A', status: 'Chưa tập' },
        { id: 2, name: 'Trần Thị B', status: 'Đang tập' },
        { id: 3, name: 'Lê Văn C', status: 'Đã tập' },
    ];

    const openPopup = (student: Student) => {
        setSelectedStudent(student);
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
        setSelectedStudent(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Danh sách học viên</Text>

            {students.map((student) => (
                <TouchableOpacity
                    key={student.id}
                    style={styles.item}
                    onPress={() => openPopup(student)}
                >
                    <Text style={styles.name}>{student.name}</Text>
                    <Text style={styles.status}>{student.status}</Text>
                </TouchableOpacity>
            ))}

            {/* Popup */}
            <Modal
                isVisible={isPopupVisible}
                backdropOpacity={0.4}
                animationIn="fadeIn"
                animationOut="fadeOut"
                onBackdropPress={closePopup}
                useNativeDriver
            >
                <View style={styles.popup}>
                    <Text style={styles.popupTitle}>Chi tiết học viên</Text>
                    {selectedStudent && (
                        <>
                            <Text>Tên: {selectedStudent.name}</Text>
                            <Text>Trạng thái: {selectedStudent.status}</Text>
                        </>
                    )}
                    <TouchableOpacity style={styles.closeBtn} onPress={closePopup}>
                        <Text style={{ color: 'white' }}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f2f2f2' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    item: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8 },
    name: { fontSize: 16, fontWeight: '500' },
    status: { fontSize: 12, color: '#666' },
    popup: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        width: width * 0.8,
        alignSelf: 'center',
    },
    popupTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    closeBtn: {
        marginTop: 20,
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
});
