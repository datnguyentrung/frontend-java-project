import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@providers/AuthProvider';
import { loginAPI } from '@/services/auth/authService';
import { useEffect } from 'react';
import { getDeviceInfo } from '@utils/deviceInfo';
import { User } from '@/types/Auth/UsersTypes';

const { width, height } = Dimensions.get('window');

export default function SignInScreen() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [idDevice, setIdDevice] = useState<string | null>(null);
    const { signIn } = useAuth();

    useEffect(() => {
        const fetchDeviceInfo = async () => {
            const { uniqueId } = await getDeviceInfo();
            setIdDevice(uniqueId);
        };
        fetchDeviceInfo();
    }, []);

    const handleSignIn = async () => {
        if (!userId.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập User ID');
            return;
        }

        if (!password.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
            return;
        }

        if (!idDevice) {
            Alert.alert('Lỗi', 'Không lấy được ID thiết bị');
            return;
        }

        setIsLoading(true);

        try {
            // Gọi API
            const loginResult = await loginAPI({
                idAccount: userId.trim(),
                password: password.trim(),
                idDevice: idDevice || '',
            });

            // --- Cải tiến 1: Xử lý trường hợp API trả về rỗng mà không báo lỗi ---
            if (!loginResult) {
                Alert.alert("Lỗi Mạng", "Không thể kết nối đến máy chủ. Vui lòng thử lại.");
                return; // Dừng thực thi
            }

            // Lấy statusCode
            const statusCode = loginResult.statusCode || loginResult.status;

            switch (statusCode) {
                case 200:
                    // --- Cải tiến 2: Kiểm tra dữ liệu tồn tại (FIX LỖI TYPESCRIPT) ---
                    // Chỉ khi status là 200, ta mới kiểm tra xem data và user có thực sự tồn tại không
                    const { data } = loginResult;

                    if (data && data.user && data.access_token && data.refresh_token) {
                        // Bây giờ TypeScript biết chắc chắn loginResult.data.user tồn tại
                        // Bạn có thể gán mà không cần `?.`
                        const startObj = new Date(data.user.startDate);
                        data.user.startDate = startObj;

                        const userData: User = {
                            username: userId.trim(),
                            // !!! XEM CẢNH BÁO BẢO MẬT BÊN DƯỚI !!!
                            password: password.trim(),
                            access_token: data.access_token,
                            refresh_token: data.refresh_token,
                            // Bạn có thể gán thẳng data.user nếu cấu trúc nó khớp với `info`
                            info: data.user,
                        };

                        // Đăng nhập
                        await signIn(userData);

                        Alert.alert(
                            '🎉 Đăng nhập thành công!',
                            `Chào mừng bạn đến với ứng dụng`
                        );

                    } else {
                        // Xử lý trường hợp API trả về 200 nhưng thiếu dữ liệu
                        Alert.alert(
                            "🚨 Lỗi Dữ Liệu",
                            "Phản hồi từ máy chủ không đầy đủ. Vui lòng thử lại."
                        );
                    }
                    break;

                case 400:
                    Alert.alert("❌ Đăng nhập thất bại", "Sai mật khẩu rồi 😥\nThử lại nhé!");
                    break;

                case 500:
                    Alert.alert("⚠️ Không tìm thấy tài khoản", "Vui lòng kiểm tra lại thông tin đăng nhập 🔍");
                    break;

                default:
                    // --- Cải tiến 3: Xử lý các mã lỗi khác ---
                    const message = loginResult.message || "Lỗi không xác định";
                    Alert.alert(`🚨 Lỗi ${statusCode}`, message);
                    break;
            }
        } catch (error: any) { // Thêm kiểu 'any' để có thể truy cập .message
            // --- Cải tiến 4: Báo lỗi từ khối catch rõ ràng hơn ---
            console.error("Login API Error:", error); // Log lỗi ra console để debug
            Alert.alert(
                'Lỗi Kết Nối',
                `Đăng nhập thất bại: ${error.message || 'Vui lòng thử lại.'}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });
        const hideSub = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#FF5252', '#FF8A80', '#FFCDD2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <View style={styles.content}>
                        {/* Header Section */}
                        <View style={styles.headerSection}>
                            <View style={styles.logoContainer}>
                                <View style={styles.logoCircle}>
                                    <Text style={styles.logoText}>🥋</Text>
                                </View>
                            </View>
                            <Text style={styles.welcomeTitle}>Taekwondo Văn Quán</Text>
                            {!isKeyboardVisible && (
                                <Text style={styles.welcomeSubtitle}>
                                    Rèn luyện hôm nay, tỏa sáng ngày mai ❤️‍🔥
                                </Text>
                            )}

                        </View>

                        {/* Form Section */}
                        <View style={styles.formSection}>
                            <View style={styles.card}>
                                {/* User ID Input */}
                                <View style={styles.inputContainer}>
                                    <View style={styles.inputIconContainer}>
                                        <Ionicons name="person-circle-outline" size={20} color="#FF5252" />
                                    </View>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Nhập User ID"
                                        placeholderTextColor="#9E9E9E"
                                        value={userId}
                                        onChangeText={setUserId}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>

                                {/* Password Input */}
                                <View style={styles.inputContainer}>
                                    <View style={styles.inputIconContainer}>
                                        <Ionicons name="lock-closed" size={20} color="#FF5252" />
                                    </View>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Nhập mật khẩu"
                                        placeholderTextColor="#9E9E9E"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!isPasswordVisible}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeIconContainer}
                                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                    >
                                        <Ionicons
                                            name={isPasswordVisible ? 'eye' : 'eye-off'}
                                            size={20}
                                            color="#9E9E9E"
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Sign In Button */}
                                <TouchableOpacity
                                    style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
                                    onPress={handleSignIn}
                                    disabled={isLoading}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#FF5252', '#E53935']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.signInButtonGradient}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator size="small" color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.signInButtonText}>Đăng nhập</Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* Footer Links */}
                                <View style={styles.footerLinks}>
                                    <TouchableOpacity>
                                        <Text style={styles.linkText}>Quên mật khẩu?</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Bottom Section */}
                        {!isKeyboardVisible && (
                            <View style={styles.bottomSection}>
                                <Text style={styles.bottomText}>
                                    Bằng cách đăng nhập, bạn đồng ý với{' '}
                                    <Text style={styles.bottomLinkText}>Điều khoản sử dụng</Text>
                                    {' '}và{' '}
                                    <Text style={styles.bottomLinkText}>Chính sách bảo mật</Text>
                                </Text>
                            </View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
    },
    headerSection: {
        alignItems: 'center',
        paddingTop: height * 0.08,
    },
    logoContainer: {
        marginBottom: 32,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    logoText: {
        fontSize: 48,
    },
    welcomeTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
    },
    formSection: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 16,
        },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        paddingHorizontal: 16,
        height: 56,
    },
    inputIconContainer: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#263238',
        paddingVertical: 0,
    },
    eyeIconContainer: {
        padding: 4,
    },
    signInButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 8,
    },
    signInButtonDisabled: {
        opacity: 0.7,
    },
    signInButtonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    footerLinks: {
        alignItems: 'center',
        marginTop: 24,
    },
    linkText: {
        fontSize: 14,
        color: '#FF5252',
        fontWeight: '600',
    },
    bottomSection: {
        paddingBottom: 32,
        alignItems: 'center',
    },
    bottomText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 18,
    },
    bottomLinkText: {
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
