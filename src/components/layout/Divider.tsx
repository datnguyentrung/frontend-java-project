import { View, StyleSheet } from 'react-native';
export default function Divider() {
    return (
        <View style={styles.container}>
            <View style={styles.line} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 3
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#b4b4b43a',
    },
});
