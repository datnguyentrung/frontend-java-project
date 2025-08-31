import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * CustomButton - Component button tùy chỉnh
 * Đây là ví dụ về cách tạo component có thể tái sử dụng
 * 
 * Props:
 * - title: Text hiển thị trên button
 * - onPress: Function được gọi khi nhấn button
 * - variant: Loại button ('primary', 'secondary', 'warning')
 * - disabled: Trạng thái vô hiệu hóa button
 */

interface CustomButtonProps {
    title: string;                    // Tiêu đề button
    onPress: () => void;             // Hàm xử lý khi nhấn
    variant?: 'primary' | 'secondary' | 'warning'; // Kiểu button
    disabled?: boolean;              // Trạng thái disabled
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false
}) => {
    // Xác định style dựa trên variant
    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondaryButton;
            case 'warning':
                return styles.warningButton;
            default:
                return styles.primaryButton;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondaryText;
            case 'warning':
                return styles.warningText;
            default:
                return styles.primaryText;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,        // Style cơ bản
                getButtonStyle(),     // Style theo variant
                disabled && styles.disabledButton  // Style khi disabled
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}     // Hiệu ứng khi nhấn
        >
            <Text style={[
                styles.buttonText,
                getTextStyle(),
                disabled && styles.disabledText
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

// Styles cho component
const styles = StyleSheet.create({
    // Style cơ bản cho button
    button: {
        paddingVertical: 12,      // Padding dọc
        paddingHorizontal: 24,    // Padding ngang
        borderRadius: 8,          // Bo góc
        alignItems: 'center',     // Căn giữa nội dung
        justifyContent: 'center',
        minWidth: 120,            // Chiều rộng tối thiểu
        marginVertical: 8,        // Margin dọc
    },

    // Style cho text
    buttonText: {
        fontSize: 16,
        fontWeight: '600',        // Chữ hơi đậm
    },

    // Style theo variant
    primaryButton: {
        backgroundColor: '#007bff', // Xanh dương
    },
    primaryText: {
        color: '#fff',            // Chữ trắng
    },

    secondaryButton: {
        backgroundColor: '#28a745', // Xanh lá
    },
    secondaryText: {
        color: '#fff',
    },

    warningButton: {
        backgroundColor: '#ffc107', // Vàng
    },
    warningText: {
        color: '#333',            // Chữ đen
    },

    // Style khi disabled
    disabledButton: {
        backgroundColor: '#ccc',   // Xám
        opacity: 0.6,             // Làm mờ
    },
    disabledText: {
        color: '#666',            // Chữ xám
    },
});

export default CustomButton;
