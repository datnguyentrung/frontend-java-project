import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { CameraView, Camera } from 'expo-camera';

export default function ScanScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getCameraPermissions();
    }, []);

    const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        Alert.alert('QR Code Scanned', `Data: ${data}`, [
            {
                text: 'Scan Again',
                onPress: () => setScanned(false),
                style: 'default'
            },
            { text: 'OK', style: 'default' }
        ]);
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Requesting camera permission...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Camera Permission Required</Text>
                <Text style={styles.subtitle}>Please grant camera permission to scan QR codes</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.absoluteFill}
                facing={'back'}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr', 'pdf417'],
                }}
            />
            <View style={styles.overlay}>
                <View style={styles.scanArea}>
                    <Text style={styles.instructionText}>
                        {scanned ? 'Tap "Scan Again" to scan another code' : 'Point camera at QR code'}
                    </Text>
                </View>
            </View>
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
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    absoluteFill: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    scanArea: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#00ff00',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    instructionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
});