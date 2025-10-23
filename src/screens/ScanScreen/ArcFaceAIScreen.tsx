import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
    StatusBar,
    Platform,
    ActivityIndicator
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraView } from 'expo-camera';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { recognizeCoach } from '@/services/ai/arcFaceService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Navigation route params
interface RouteParams {
    onHandleArcFaceAI?: (idCoach: string, nameCoach: string) => void;
    returnScreen?: string;
}

type ArcFaceAIRouteProp = RouteProp<{ ArcFaceAIScreen: RouteParams }, 'ArcFaceAIScreen'>;

interface RecognitionResult {
    success: boolean;
    message: string;
    status?: boolean;
    id_coach?: string;
    name?: string;
    data?: {
        name: string;
        similarity: number;
    }
}

export default function ArcFaceAIScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
    const [lastScanTime, setLastScanTime] = useState<number>(0);
    const [facing, setFacing] = useState<'front' | 'back'>('front');
    const [isProcessing, setIsProcessing] = useState(false);

    const cameraRef = useRef<CameraView>(null);
    const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const navigation = useNavigation();
    const route = useRoute<ArcFaceAIRouteProp>();
    const params = route.params;

    const SCAN_INTERVAL = 5000; // 5 giây
    const MIN_SIMILARITY = 0.7; // Ngưỡng tối thiểu để coi là nhận diện thành công

    useEffect(() => {
        getCameraPermissions();
        return () => {
            // Cleanup khi component unmount
            if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isScanning && cameraReady) {
            startContinuousScanning();
        } else {
            stopContinuousScanning();
        }
    }, [isScanning, cameraReady]);

    const getCameraPermissions = async () => {
        try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        } catch (error) {
            console.error('Error requesting camera permission:', error);
            setHasPermission(false);
        }
    };

    const captureAndRecognize = async () => {
        if (!cameraRef.current || !cameraReady || isProcessing) return;

        const now = Date.now();
        if (now - lastScanTime < SCAN_INTERVAL) {
            console.log('Waiting for next scan interval...');
            return;
        }

        try {
            setIsProcessing(true);
            setLastScanTime(now);

            // Chụp ảnh
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: true,
                skipProcessing: false,
            });

            if (photo?.base64) {
                console.log('📷 Image captured, recognizing...');

                // Gọi API nhận diện
                const result = await recognizeCoach(photo.base64);

                console.log('🤖 Recognition result:', result);
                setRecognitionResult(result);

                // Nếu nhận diện thành công 
                if (result.success === true) {
                    setIsScanning(false); // Dừng scan tự động ngay lập tức
                    stopContinuousScanning(); // Dừng interval

                    // Kiểm tra trạng thái tài khoản
                    if (result.status === false) {
                        Alert.alert(
                            'Tài khoản không được nhận diện',
                            'Rất tiếc, tài khoản này không được hệ thống nhận diện.',
                            [
                                { text: 'Tiếp tục scan', onPress: () => setIsScanning(true) },
                                { text: 'Đóng', style: 'cancel' }
                            ]
                        );
                        return;
                    }

                    // Tự động gọi callback và goBack khi thành công
                    if (params?.onHandleArcFaceAI && result.id_coach && result.name) {
                        // Gọi callback với id_coach và name
                        params.onHandleArcFaceAI(result.id_coach, result.name);

                        // Quay về màn hình trước ngay lập tức
                        navigation.goBack();
                    } else {
                        // Nếu không có callback, hiển thị thông báo thành công
                        Alert.alert(
                            'Nhận diện thành công! 🎉',
                            `Chào ${result.name || 'Không xác định'}!`,
                            [{ text: 'OK', onPress: () => navigation.goBack() }]
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Error in face recognition:', error);
            setRecognitionResult({
                success: false,
                message: 'Lỗi nhận diện khuôn mặt'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const startContinuousScanning = () => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
        }

        scanIntervalRef.current = setInterval(() => {
            if (isScanning && cameraReady) {
                captureAndRecognize();
            }
        }, SCAN_INTERVAL);

        // Chụp ảnh ngay lập tức
        captureAndRecognize();
    };

    const stopContinuousScanning = () => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }
    };

    const toggleScanning = () => {
        setIsScanning(!isScanning);
        setRecognitionResult(null);
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const goBack = () => {
        navigation.goBack();
    };

    if (hasPermission === null) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Đang yêu cầu quyền truy cập camera...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.permissionContainer}>
                <MaterialIcons name="camera-alt" size={64} color="#DC2626" />
                <Text style={styles.permissionTitle}>Cần quyền truy cập Camera</Text>
                <Text style={styles.permissionSubtitle}>
                    Vui lòng cấp quyền truy cập camera để sử dụng tính năng nhận diện khuôn mặt
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={getCameraPermissions}>
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
                onCameraReady={() => setCameraReady(true)}
            />

            {/* Top controls */}
            <View style={styles.topControls}>
                <TouchableOpacity style={styles.topButton} onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.titleText}>Nhận diện khuôn mặt AI</Text>

                <TouchableOpacity style={styles.topButton} onPress={toggleCameraFacing}>
                    <Ionicons name="camera-reverse" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Face detection overlay */}
            <View style={styles.overlay}>
                <View style={styles.faceFrame}>
                    <View style={styles.cornerTopLeft} />
                    <View style={styles.cornerTopRight} />
                    <View style={styles.cornerBottomLeft} />
                    <View style={styles.cornerBottomRight} />

                    <Text style={styles.instructionText}>
                        Đặt khuôn mặt vào khung
                    </Text>
                </View>
            </View>

            {/* Recognition Result */}
            {recognitionResult && (
                <View style={styles.resultContainer}>
                    <LinearGradient
                        colors={recognitionResult.success
                            ? ['rgba(22, 163, 74, 0.9)', 'rgba(21, 128, 61, 0.9)']
                            : ['rgba(220, 38, 38, 0.9)', 'rgba(185, 28, 28, 0.9)']
                        }
                        style={styles.resultCard}
                    >
                        <Text style={styles.resultStatus}>
                            {recognitionResult.success ? '✅ Thành công' : '❌ Không tìm thấy'}
                        </Text>

                        {recognitionResult.data && (
                            <>
                                <Text style={styles.resultName}>
                                    {recognitionResult.data.name}
                                </Text>
                                <Text style={styles.resultSimilarity}>
                                    Độ chính xác: {(recognitionResult.data.similarity * 100).toFixed(1)}%
                                </Text>
                            </>
                        )}

                        <Text style={styles.resultMessage}>
                            {recognitionResult.message}
                        </Text>
                    </LinearGradient>
                </View>
            )}

            {/* Bottom controls */}
            <View style={styles.bottomControls}>
                <TouchableOpacity
                    style={styles.manualScanButton}
                    onPress={captureAndRecognize}
                    disabled={isProcessing || !cameraReady}
                >
                    <MaterialIcons name="face-retouching-natural" size={32} color="#fff" />
                    <Text style={styles.buttonText}>Scan 1 lần</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        isScanning ? styles.stopButton : styles.startButton
                    ]}
                    onPress={toggleScanning}
                    disabled={!cameraReady}
                    activeOpacity={0.8}
                >
                    {isProcessing ? (
                        <ActivityIndicator size="large" color="#fff" />
                    ) : (
                        <MaterialIcons
                            name={isScanning ? "stop" : "play-arrow"}
                            size={40}
                            color="#fff"
                        />
                    )}
                    <Text style={styles.toggleButtonText}>
                        {isScanning ? 'Dừng scan' : 'Bắt đầu scan'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>
                        {isScanning ? `Đang scan... (${SCAN_INTERVAL / 1000}s)` : 'Chưa bắt đầu'}
                    </Text>
                    {isProcessing && (
                        <ActivityIndicator size="small" color="#fff" style={styles.processingIndicator} />
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    permissionText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    permissionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    permissionSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    camera: {
        flex: 1,
    },
    topControls: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 1,
    },
    topButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    faceFrame: {
        width: 280,
        height: 360,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#00ff00',
        borderTopLeftRadius: 20,
    },
    cornerTopRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: '#00ff00',
        borderTopRightRadius: 20,
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#00ff00',
        borderBottomLeftRadius: 20,
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: '#00ff00',
        borderBottomRightRadius: 20,
    },
    instructionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 12,
        borderRadius: 8,
        marginTop: 40,
    },
    resultContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 120 : 100,
        left: 20,
        right: 20,
        zIndex: 2,
    },
    resultCard: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    resultStatus: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    resultName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    resultSimilarity: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    resultMessage: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.9,
    },
    bottomControls: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 30,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        zIndex: 1,
    },
    manualScanButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    toggleButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginBottom: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    startButton: {
        backgroundColor: '#16A34A', // Green
    },
    stopButton: {
        backgroundColor: '#DC2626', // Red
    },
    toggleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    statusContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
    },
    statusText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    processingIndicator: {
        marginLeft: 8,
    },
});