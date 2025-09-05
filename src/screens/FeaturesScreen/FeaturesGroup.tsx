import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@/styles/gradients';
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useQuickAccess } from '@/store/useQuickAccess';
import { fontStyles } from '@/utils/fonts';
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native';
import { navigateToFeature } from '@/navigation/FeatureNavigator'

type FeaturesGroupProps = {
    title: string;
    features: any[];
    change: boolean;
    setChange: (value: boolean) => void;
    canChange: boolean;
    // setLoading: (value: boolean) => void;
};

export default function FeaturesGroup({
    title, features, change, setChange, canChange
}: FeaturesGroupProps) {
    const isQuickAccess = title === 'quickAccess';
    const navigation = useNavigation();

    // State để lưu trữ quick access items
    const [quickAccessItems, setQuickAccessItems] = useState<Set<number>>(new Set());

    // Chỉ log một lần khi features thay đổi
    useEffect(() => {
        if (isQuickAccess && features.length > 0) {
            console.log('Quick Access Features:', features.map(f => f.idFeature));
        }
    }, [features, isQuickAccess]);

    const { addToQuickAccess, removeFromQuickAccess, checkIfInQuickAccess } = useQuickAccess();

    // Load quick access items khi component mount
    useEffect(() => {
        const loadQuickAccessItems = async () => {
            const quickAccessSet = new Set<number>();
            for (const feature of features) {
                const isInQuickAccess = await checkIfInQuickAccess(feature.idFeature);
                if (isInQuickAccess) {
                    quickAccessSet.add(feature.idFeature);
                }
            }
            setQuickAccessItems(quickAccessSet);
        };

        if (features.length > 0) {
            loadQuickAccessItems();
        }
    }, [features]); // Bỏ checkIfInQuickAccess khỏi dependency array

    // Hàm xử lý khi nhấn button
    const handleButtonPress = (buttonName: string) => {
        console.log('🚀 Feature pressed:', buttonName);

        // Sử dụng navigation helper từ FeatureNavigator
        const success = navigateToFeature(buttonName, navigation);

        if (!success) {
            // Fallback alert nếu không tìm thấy screen
            Alert.alert(
                'Thông báo',
                `Tính năng "${buttonName}" đang được phát triển`,
                [{ text: 'OK', style: 'default' }]
            );
        }
    };

    const handleChooseItem = async (item: any) => {
        try {
            if (isQuickAccess) {
                await removeFromQuickAccess(item.idFeature);
                setQuickAccessItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(item.idFeature);
                    return newSet;
                });
            } else {
                await addToQuickAccess(item);
                setQuickAccessItems(prev => new Set(prev).add(item.idFeature));
            }
        } catch (error) {
            console.error('Error handling quick access:', error);
        }
    };

    useEffect(() => {
        if (change === false && isQuickAccess) {
            setChange(true);
        }
    }, [change, isQuickAccess, setChange]); // Thêm dependencies đầy đủ

    const renderButtonChange = (item: any) => {
        if (canChange) {
            return (
                <Pressable onPress={() => handleChooseItem(item)}
                    style={[
                        styles.buttonContainer,
                        { backgroundColor: isQuickAccess ? '#dc2626' : '#35fff2ff' }
                    ]}>
                    <FontAwesome
                        name={isQuickAccess ? "minus" : "plus"}
                        size={12}
                        color="#ffffffff"
                    />
                </Pressable>
            );
        }
        return null;
    };

    const renderContent = () => {
        // Nếu không phải QuickAccess, filter ra những items đã có trong QuickAccess
        const filteredFeatures = isQuickAccess
            ? features
            : features.filter(feature => !quickAccessItems.has(feature.idFeature));

        return (
            <FlatList
                data={filteredFeatures}
                numColumns={4}   // 4 cột
                scrollEnabled={false}
                keyExtractor={(item) => item.idFeature.toString()}
                // columnWrapperStyle={{ gap: 10 }}
                renderItem={({ item }) => {
                    const IconComponent = item.iconComponent;

                    // Sử dụng state thay vì async call
                    const isInQuickAccess = quickAccessItems.has(item.idFeature);

                    return (
                        <Pressable style={styles.box} >
                            <Pressable
                                disabled={canChange}
                                onPress={() => handleButtonPress(item.title)}
                                style={[
                                    styles.iconContainer,
                                    {
                                        backgroundColor: isQuickAccess ? "#fff6f6ff"
                                            : isInQuickAccess ? "#e7e7e7ff"
                                                : "#ffcccca2"
                                    }
                                ]}>
                                <IconComponent
                                    size={30}
                                    color="#bc0000ff"
                                />
                            </Pressable>
                            {!(isInQuickAccess && !isQuickAccess) && renderButtonChange(item)}
                            <Text style={[
                                styles.title,
                                fontStyles.caption,
                                {
                                    color: isQuickAccess ? '#ffffffff' : '#444444ff',
                                    fontWeight: '700',
                                    letterSpacing: 1,
                                }
                            ]}>
                                {item.title}
                            </Text>
                        </Pressable>
                    );
                }}
            />
        );
    };

    return (
        <View style={styles.container}>
            <Text style={[
                fontStyles.h3,
                styles.groupTitle,
                { color: isQuickAccess ? '#dc2626' : '#333333' }
            ]}>
                {isQuickAccess ? 'Truy cập nhanh' : title}
            </Text>
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
    groupTitle: {
        marginBottom: 12,
        paddingHorizontal: 8,
        fontWeight: 'bold',
    },
    groupIcon: {
        paddingHorizontal: 5, // Khoảng cách bên trái và bên phải
        paddingVertical: 15, // Khoảng cách bên trên và bên dưới
        borderRadius: 8,
    },
    box: {
        width: '19%',       // Fixed width: 19% x 4 = 76%, còn 24% cho margins
        marginHorizontal: '3%',       // Margin 3% cho mỗi bên
        marginVertical: 5,  // Khoảng cách dọc giữa các box
        height: 100,        // Chiều cao cố định để tất cả box đều nhau
        alignItems: "center",
        justifyContent: "flex-start", // Căn từ trên xuống
        position: 'relative', // Thêm relative position để chứa absolute children
        // paddingTop: 8,      // Khoảng cách từ top
    },
    iconContainer: {
        width: '80%',       // Chiều rộng icon container
        aspectRatio: 1,     // Tỷ lệ vuông 1:1
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        marginBottom: 8,    // Khoảng cách cố định giữa icon và title
    },
    title: {
        textAlign: 'center',
        height: 35,         // Chiều cao cố định cho 2 dòng text
        width: '100%',      // Full width
        flexWrap: 'wrap',   // Cho phép wrap text
        // Các style khác sẽ được override bởi fontStyles.caption
    },
    buttonContainer: {
        borderRadius: 15,    // Điều chỉnh borderRadius cố định
        width: 20,           // Width cố định thay vì aspectRatio
        height: 20,          // Height cố định để đảm bảo hình tròn
        alignItems: "center",
        justifyContent: "center",
        position: 'absolute', // Thêm position absolute
        right: '1%',            // Điều chỉnh vị trí từ trái
        top: '-5%',          // Điều chỉnh vị trí từ dưới
        // elevation: 5,        // Thêm elevation cho Android
    },
});