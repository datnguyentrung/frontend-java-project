import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { uploadToBytescale, getFileInfo } from '@/utils/uploadToBytescale';
import * as ImageManipulator from 'expo-image-manipulator';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface RouteParams {
    onImageSelected?: (fileName: string, fileUri: string) => void;
    returnScreen?: string;
}

type PhotoCaptureRouteProp = RouteProp<{ PhotoCaptureScreen: RouteParams }, 'PhotoCaptureScreen'>;

export default function PhotoCaptureScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [facing, setFacing] = useState<'front' | 'back'>('back');

    const cameraRef = useRef<CameraView>(null);
    const navigation = useNavigation();
    const route = useRoute<PhotoCaptureRouteProp>();
    const params = route.params;

    useEffect(() => {
        getCameraPermissions();
    }, []);

    const getCameraPermissions = async () => {
        try {
            // Request camera permission
            const cameraStatus = await Camera.requestCameraPermissionsAsync();

            // Request media library permission for image picker
            const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

            setHasPermission(
                cameraStatus.status === 'granted' &&
                mediaLibraryStatus.status === 'granted'
            );
        } catch (error) {
            console.error('Error requesting permissions:', error);
            setHasPermission(false);
        }
    };

    const takePicture = async () => {
        if (!cameraRef.current || !cameraReady || isProcessing) return;

        try {
            setIsProcessing(true);

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: false,
                skipProcessing: false,
            });

            if (photo?.uri) {
                let finalUri = photo.uri;

                // 🔁 Nếu là camera trước thì lật ngang ảnh thật sự
                if (facing === 'front') {
                    try {
                        const flipped = await ImageManipulator.manipulateAsync(
                            photo.uri,
                            [{ flip: ImageManipulator.FlipType.Horizontal }],
                            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                        );
                        finalUri = flipped.uri;
                    } catch (flipError) {
                        console.warn('Failed to flip front camera image:', flipError);
                        // Fallback: sử dụng ảnh gốc, người dùng có thể tự lật sau
                        finalUri = photo.uri;
                    }
                }

                setCapturedImage(finalUri);
            }
        } catch (error) {
            console.error('Error taking picture:', error);
            Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
        } finally {
            setIsProcessing(false);
        }
    };

    const pickImageFromLibrary = async () => {
        try {
            setIsProcessing(true);

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setCapturedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Lỗi', 'Không thể chọn ảnh từ thư viện. Vui lòng thử lại.');
        } finally {
            setIsProcessing(false);
        }
    };

    const confirmImage = async () => {
        if (!capturedImage) return;

        try {
            setIsProcessing(true);

            // Get file info
            const fileInfo = getFileInfo(capturedImage);
            const fileName = `coach_attendance_${Date.now()}.${fileInfo.extension}`;

            // Call the callback function if provided
            if (params?.onImageSelected) {
                params.onImageSelected(fileName, capturedImage);
            }

            // Navigate back to the previous screen
            navigation.goBack();

        } catch (error) {
            console.error('Error processing image:', error);
            Alert.alert('Lỗi', 'Không thể xử lý ảnh. Vui lòng thử lại.');
        } finally {
            setIsProcessing(false);
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
    };

    const goBack = () => {
        navigation.goBack();
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    if (hasPermission === null) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Đang yêu cầu quyền truy cập...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.permissionContainer}>
                <MaterialIcons name="camera-alt" size={64} color="#DC2626" />
                <Text style={styles.permissionTitle}>Cần quyền truy cập Camera</Text>
                <Text style={styles.permissionSubtitle}>
                    Vui lòng cấp quyền truy cập camera và thư viện ảnh để sử dụng tính năng này
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={getCameraPermissions}>
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Show captured image with confirm/retake options
    if (capturedImage) {
        return (
            <View style={styles.previewContainer}>
                <StatusBar hidden />
                <Image
                    source={{ uri: capturedImage }}
                    style={styles.previewImage}
                />

                <View style={styles.previewActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={retakePhoto}
                        activeOpacity={0.8}
                        disabled={isProcessing}
                    >
                        <Ionicons name="close" size={32} color="#fff" />
                        <Text style={styles.actionButtonText}>Chụp lại</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.confirmButton]}
                        onPress={confirmImage}
                        activeOpacity={0.8}
                        disabled={isProcessing}
                    >
                        <Ionicons name="checkmark" size={32} color="#fff" />
                        <Text style={styles.actionButtonText}>
                            {isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Camera view
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

                <Text style={styles.titleText}>Chụp ảnh minh chứng</Text>

                <TouchableOpacity style={styles.topButton} onPress={toggleCameraFacing}>
                    <Ionicons name="camera-reverse" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Bottom controls */}
            <View style={styles.bottomControls}>
                <TouchableOpacity
                    style={styles.galleryButton}
                    onPress={pickImageFromLibrary}
                    disabled={isProcessing}
                >
                    <MaterialIcons name="photo-library" size={32} color="#fff" />
                    <Text style={styles.galleryButtonText}>Thư viện</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
                    onPress={takePicture}
                    disabled={!cameraReady || isProcessing}
                    activeOpacity={0.8}
                >
                    <View style={styles.captureButtonInner} />
                </TouchableOpacity>

                <View style={styles.placeholderButton} />
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
    bottomControls: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        zIndex: 1,
    },
    galleryButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    galleryButtonText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    captureButtonDisabled: {
        opacity: 0.5,
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#DC2626',
    },
    placeholderButton: {
        width: 80,
        height: 80,
    },
    previewContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    previewImage: {
        flex: 1,
        width: screenWidth,
        height: screenHeight,
    },
    previewActions: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    cancelButton: {
        backgroundColor: '#DC2626',
    },
    confirmButton: {
        backgroundColor: '#16A34A',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
});
