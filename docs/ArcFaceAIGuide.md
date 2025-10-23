# ArcFaceAIScreen - Hướng dẫn sử dụng

## Tổng quan
`ArcFaceAIScreen` là component nhận diện khuôn mặt AI sử dụng thuật toán ArcFace. Component này gửi định kỳ ảnh dạng base64 lên server để nhận diện HLV và trả về thông tin chi tiết.

## Tính năng chính

### 1. Quyền truy cập (Permissions)
- **Camera Permission**: Yêu cầu quyền sử dụng camera tương tự PhotoCaptureScreen
- Giao diện thân thiện khi chưa có quyền với nút "Thử lại"

### 2. Camera AI Recognition
- Sử dụng camera trước (front) mặc định để nhận diện
- Nút chuyển đổi camera (front/back)
- Khung nhận diện khuôn mặt với góc bo tròn màu xanh lá
- Real-time preview với overlay instruction

### 3. Scan tự động định kỳ
- **Interval**: 5 giây giữa các lần scan
- **Auto-capture**: Tự động chụp ảnh và gửi lên API
- **Throttling**: Kiểm soát để tránh spam API
- **Background processing**: Không block UI khi đang xử lý

### 4. Scan thủ công
- Nút "Scan 1 lần" để test ngay lập tức
- Không bị giới hạn bởi interval 5 giây

### 5. Kết quả nhận diện
- **Hiển thị real-time**: Kết quả xuất hiện ngay trên màn hình
- **Thông tin chi tiết**: Tên HLV, độ chính xác phần trăm
- **Color coding**: Xanh lá (thành công) / Đỏ (thất bại)
- **Auto-stop**: Dừng scan tự động khi nhận diện thành công với độ chính xác cao

## API Integration

### recognizeCoach Function
```typescript
// API call
const result = await recognizeCoach(photo.base64, 0.5);

// Response structure
interface RecognitionResult {
    success: boolean;
    message: string;
    data?: {
        name: string;         // Tên HLV
        similarity: number;   // Độ tương đồng (0-1)
    }
}
```

### Request Format
- **Input**: Image base64 string
- **Threshold**: 0.5 (default threshold cho API)
- **Headers**: Content-Type: application/json
- **Method**: POST

## UI Components

### 1. **Camera View**
- Full screen camera với CameraView của expo-camera
- Front camera mặc định (tốt nhất cho nhận diện khuôn mặt)
- Camera ready indicator

### 2. **Face Detection Frame**
- Khung hình chữ nhật 280x360px
- 4 góc bo tròn màu xanh lá (#00ff00)
- Text hướng dẫn ở giữa khung

### 3. **Top Controls**
- Nút Back (arrow-back)
- Title: "Nhận diện khuôn mặt AI"
- Nút chuyển camera (camera-reverse)

### 4. **Result Display**
- Card với LinearGradient
- **Success**: Gradient xanh lá
- **Failure**: Gradient đỏ
- Hiển thị: Status, Name, Similarity, Message

### 5. **Bottom Controls**
- **Scan 1 lần**: Nút scan thủ công
- **Bắt đầu/Dừng scan**: Toggle button với icon play/stop
- **Status indicator**: Text hiển thị trạng thái + loading indicator

## Logic Flow

### 1. Permission Request
```typescript
const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
};
```

### 2. Continuous Scanning
```typescript
// Start interval scanning
const startContinuousScanning = () => {
    scanIntervalRef.current = setInterval(() => {
        if (isScanning && cameraReady) {
            captureAndRecognize();
        }
    }, SCAN_INTERVAL); // 5000ms
};
```

### 3. Capture & Recognize
```typescript
const captureAndRecognize = async () => {
    // Throttle protection
    if (now - lastScanTime < SCAN_INTERVAL) return;
    
    // Capture with base64
    const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        skipProcessing: false,
    });
    
    // API call
    const result = await recognizeCoach(photo.base64);
    
    // Process result
    setRecognitionResult(result);
};
```

### 4. Success Handling
```typescript
if (result.success && result.data?.similarity >= MIN_SIMILARITY) {
    setIsScanning(false); // Auto-stop scanning
    Alert.alert('Nhận diện thành công! 🎉', 
        `Chào ${result.data.name}!\nĐộ chính xác: ${similarity}%`
    );
}
```

## Configuration

### Constants
```typescript
const SCAN_INTERVAL = 5000;     // 5 giây
const MIN_SIMILARITY = 0.7;     // 70% minimum để coi là thành công
const API_THRESHOLD = 0.5;      // Threshold gửi lên API
```

### Camera Settings
```typescript
// Camera config
facing: 'front'                  // Camera trước
quality: 0.8                     // Chất lượng ảnh
base64: true                     // Bắt buộc cho API
skipProcessing: false            // Để có ảnh chất lượng tốt
```

## Cách sử dụng

### Navigation
```typescript
// Từ bất kỳ screen nào
import { navigateToFeature } from '@/navigation/FeatureNavigator';

const openArcFaceAI = () => {
    navigateToFeature("ArcFace AI", navigation);
};

// Hoặc direct navigation
navigation.navigate('ArcFaceAIScreen');
```

### User Workflow
1. **Mở screen** → Yêu cầu permission camera
2. **Grant permission** → Camera khởi động với face frame
3. **Đặt mặt vào khung** → Nhấn "Bắt đầu scan"
4. **Auto scanning** → Mỗi 5s chụp và nhận diện tự động
5. **Thành công** → Hiển thị kết quả + option tiếp tục
6. **Thất bại** → Hiển thị lỗi, tiếp tục scan

## Error Handling

### 1. Permission Denied
- Hiển thị UI thân thiện với icon camera
- Nút "Thử lại" để request permission lại

### 2. API Errors
- Catch và log chi tiết error
- Hiển thị "Lỗi nhận diện khuôn mặt" cho user
- Không crash app, tiếp tục cho phép scan

### 3. Camera Errors
- Check cameraReady trước khi capture
- Disable buttons khi camera chưa sẵn sàng

### 4. Network Issues
- Timeout từ axios instance
- Retry logic có thể implement trong axiosInstanceAI

## Performance Optimization

### 1. **Throttling**
- Kiểm tra lastScanTime để tránh spam
- Clear interval khi component unmount

### 2. **Memory Management**
- Cleanup intervals trong useEffect cleanup
- Base64 images không lưu trong state lâu dài

### 3. **UI Responsiveness**
- setIsProcessing để disable buttons
- ActivityIndicator khi đang xử lý
- Không block UI thread

## Integration Points

### 1. **Với Authentication**
- Có thể kết hợp với AuthProvider để auto-login HLV
- Update user context sau khi nhận diện thành công

### 2. **Với Attendance System**
- Link với CoachAttendanceScreen để điểm danh tự động
- Pass recognized coach data qua navigation params

### 3. **Với Analytics**
- Log recognition success/failure rates
- Track API performance metrics

## Example Usage

```typescript
// Basic navigation
const openFaceRecognition = () => {
    navigation.navigate('ArcFaceAIScreen');
};

// Với callback (future enhancement)
const openFaceRecognitionWithCallback = () => {
    navigation.navigate('ArcFaceAIScreen', {
        onRecognitionSuccess: (coachData) => {
            console.log('Coach recognized:', coachData);
            // Auto-fill attendance form
        }
    });
};
```

## Dependencies

```json
{
  "expo-camera": "^17.0.7",
  "@expo/vector-icons": "^15.0.2",
  "expo-linear-gradient": "~15.0.7",
  "@react-navigation/native": "^7.1.17"
}
```

App của bạn giờ đây có hệ thống nhận diện khuôn mặt AI hoàn chỉnh! 🤖✨