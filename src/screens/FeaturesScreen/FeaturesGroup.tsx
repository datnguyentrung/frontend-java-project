import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@/styles/gradients';
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { useEffect } from 'react';

type FeaturesGroupProps = {
    title: string;
    features: any[];
    change: boolean;
    setChange: (value: boolean) => void;
    handleAddQuickAccess: (feature: any) => void;
    canChange: boolean;
};

export default function FeaturesGroup({
    title, features, change, setChange, handleAddQuickAccess, canChange
}: FeaturesGroupProps) {
    const isQuickAccess = title === 'quickAccess';

    useEffect(() => {
        if (change === false && isQuickAccess) {
            setChange(true);
        }
    }, [change]);

    // Hàm xử lý khi nhấn button
    const handleButtonPress = (buttonName: string) => {
        Alert.alert(
            'Thông báo',
            `Bạn đã nhấn button: ${buttonName}`,
            [{ text: 'OK', style: 'default' }]
        );
    };

    const handleChooseItem = (item: any) => {
        if (canChange) {
            handleAddQuickAccess(item);
        } else {
            handleButtonPress(item.title);
        }
    };

    const renderContent = () => (
        <FlatList
            data={features}
            numColumns={4}   // 4 cột
            scrollEnabled={false}
            keyExtractor={(item) => item.id_feature.toString()}
            // columnWrapperStyle={{ gap: 10 }}
            renderItem={({ item }) => {
                const IconComponent = item.iconComponent;
                return (
                    <Pressable style={styles.box} onPress={() => handleChooseItem(item)}>
                        <View style={styles.iconContainer}>
                            <IconComponent
                                size={35}
                                color="#bc0000ff"
                            />
                        </View>
                        <Text style={[styles.title, { color: isQuickAccess ? '#ffffffff' : '#444444ff' }]}>{item.title}</Text>
                    </Pressable>
                );
            }}
        />
    );

    return (
        <View style={styles.container}>
            <Text>{title}</Text>
            {isQuickAccess ? (
                <LinearGradient
                    colors={gradients.neonPinkOrange}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.groupIcon}
                >
                    {renderContent()}
                </LinearGradient>
            ) : (
                <View style={styles.groupIcon}>
                    {renderContent()}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    groupIcon: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 8,
        // backgroundColor: '#ecececff',
    },
    box: {
        width: '19%',       // Fixed width: 19% x 4 = 76%, còn 24% cho margins
        marginHorizontal: '3%',       // Margin 3% cho mỗi bên
        height: 100,        // Chiều cao cố định để tất cả box đều nhau
        alignItems: "center",
        justifyContent: "flex-start", // Căn từ trên xuống
        // paddingTop: 8,      // Khoảng cách từ top
    },
    iconContainer: {
        width: '80%',       // Chiều rộng icon container
        aspectRatio: 1,     // Tỷ lệ vuông 1:1
        backgroundColor: "#ffcccca2",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        marginBottom: 8,    // Khoảng cách cố định giữa icon và title
    },
    title: {
        fontSize: 13,       // Giảm size để tránh wrap
        textAlign: 'center',
        lineHeight: 14,     // Line height cố định
        height: 28,         // Chiều cao cố định cho 2 dòng text
        width: '100%',      // Full width
        flexWrap: 'wrap',   // Cho phép wrap text
        fontWeight: '700',
    },
});