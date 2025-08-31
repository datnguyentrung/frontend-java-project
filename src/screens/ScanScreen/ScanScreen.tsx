import { View, Text, StyleSheet } from 'react-native';

export default function ScanScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quét mã</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
