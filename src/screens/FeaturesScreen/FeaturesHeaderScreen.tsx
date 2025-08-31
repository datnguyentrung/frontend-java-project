import { View, StyleSheet, Pressable } from 'react-native';
import HeaderTitle from '@/components/layout/HeaderApp/HeaderTitle';
import HeaderBackground from '@/components/layout/HeaderApp/HeaderBackground';
import Constants from 'expo-constants';
// import { Pencil } from 'lucide-react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import AntDesign from '@expo/vector-icons/AntDesign'
import { red_color } from '@/styles/gradients';

export default function FeaturesHeaderScreen({ canChange, setCanChange }: { canChange: boolean, setCanChange: (value: boolean) => void }) {
    return (
        <View style={styles.container}>
            <HeaderBackground route='Features' />
            <View style={styles.titleContainer}>
                <View style={styles.bottomRow}>
                    <View style={styles.titleWrapper}>
                        <HeaderTitle>Tiện ích</HeaderTitle>
                    </View>
                    <Pressable
                        onPress={() => setCanChange(!canChange)}
                        style={[styles.iconLayout, { backgroundColor: canChange === false ? '#cccccc88' : '#ffffffff' }]}
                    >
                        {canChange === false
                            ? <FontAwesome5 name="pen" size={15} color="#ffffffff" />
                            : <AntDesign name="check" size={15} color={red_color.red_active} />
                        }
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
    },
    titleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: Constants.statusBarHeight, // Tạo khoảng cách từ status bar
        paddingBottom: 10, // Thêm padding bottom để không sát đáy
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 15, // Padding hai bên
    },
    titleWrapper: {
        flex: 1,
        alignItems: 'center', // Căn giữa title
        // justifyContent: 'flex-end'
    },
    iconLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: 15, // Sát bên phải
        paddingVertical: 10,
        paddingHorizontal: 18,
        bottom: 3,
        borderRadius: 20,
    },
});