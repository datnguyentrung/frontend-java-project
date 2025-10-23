# PhotoCaptureScreen - Hướng dẫn sử dụng

## Tổng quan
`PhotoCaptureScreen` là component cho phép người dùng chụp ảnh hoặc chọn ảnh từ thư viện thiết bị. Component này đã được tích hợp vào `CoachAttendanceFormScreen` để chụp ảnh minh chứng cho việc điểm danh.

## Tính năng chính

### 1. Quyền truy cập (Permissions)
- **Camera Permission**: Yêu cầu quyền sử dụng camera để chụp ảnh
- **Media Library Permission**: Yêu cầu quyền truy cập thư viện ảnh
- Giao diện thân thiện khi chưa có quyền với nút "Thử lại"

### 2. Chụp ảnh với Camera
- Sử dụng camera sau (back) mặc định
- Nút chuyển đổi camera (front/back)
- Nút chụp ảnh lớn ở giữa màn hình
- Preview real-time qua CameraView

### 3. Chọn ảnh từ thư viện
- Nút "Thư viện" để mở image picker
- Hỗ trợ crop ảnh với tỷ lệ 4:3
- Chất lượng ảnh được tối ưu (0.8)

### 4. Preview và xác nhận
- Hiển thị ảnh vừa chụp/chọn full screen
- 2 nút action:
  - ❌ **Chụp lại**: Quay lại camera để chụp ảnh mới
  - ✅ **Xác nhận**: Xác nhận ảnh và quay lại màn hình trước

## Cách sử dụng

### Trong CoachAttendanceFormScreen
```typescript
// Navigation với callback
(navigation as any).navigate('PhotoCaptureScreen', {
    onImageSelected: handleImageSelected,
    returnScreen: 'CoachAttendanceFormScreen'
});

// Callback function
const handleImageSelected = React.useCallback((fileName: string, fileUri: string) => {
    setFileName(fileName);
    setSelectedImage(fileUri);
    console.log('📷 Image selected:', fileName, fileUri);
}, []);
```

### Trong component khác
```typescript
import { useNavigation } from '@react-navigation/native';

const YourComponent = () => {
    const navigation = useNavigation();
    
    const handleImageResult = (fileName: string, fileUri: string) => {
        // Xử lý ảnh đã chọn
        console.log('File name:', fileName);
        console.log('File URI:', fileUri);
        
        // Upload hoặc lưu trữ ảnh
        // await uploadToBytescale(fileUri, signedUrl);
    };
    
    const openCamera = () => {
        navigation.navigate('PhotoCaptureScreen', {
            onImageSelected: handleImageResult,
            returnScreen: 'YourScreenName'
        });
    };
    
    return (
        <TouchableOpacity onPress={openCamera}>
            <Text>Chụp ảnh</Text>
        </TouchableOpacity>
    );
};
```

## Props Interface

```typescript
interface RouteParams {
    onImageSelected?: (fileName: string, fileUri: string) => void;
    returnScreen?: string;
}
```

### Parameters:
- **onImageSelected**: Callback function được gọi khi user xác nhận ảnh
  - `fileName`: Tên file được generate (format: `coach_attendance_${timestamp}.extension`)
  - `fileUri`: Đường dẫn local đến file ảnh
- **returnScreen**: Tên màn hình để quay lại (optional, dùng cho analytics)

## File Structure

```
src/screens/ScanScreen/
├── PhotoCaptureScreen.tsx     # Main component
├── ScanQRScreen.tsx          # QR Scanner (tham khảo permissions)
```

## Dependencies

```json
{
  "expo-camera": "^17.0.7",
  "expo-image-picker": "latest",
  "@expo/vector-icons": "^15.0.2",
  "expo-linear-gradient": "~15.0.7"
}
```

## Tích hợp với Upload

### Sử dụng với uploadToBytescale
```typescript
const handleImageSelected = async (fileName: string, fileUri: string) => {
    try {
        // Validate file
        const isValid = validateFile(fileUri, 10); // 10MB limit
        if (!isValid) return;
        
        // Get signed URL from your API
        const signedUrl = await getSignedUploadUrl();
        
        // Upload to Bytescale
        const uploadedUrl = await uploadToBytescale(fileUri, signedUrl, {
            onProgress: (progress) => console.log(`Upload: ${progress}%`),
            maxFileSizeMB: 10
        });
        
        console.log('✅ Uploaded successfully:', uploadedUrl);
        
        // Update form data
        setFileName(fileName);
        setUploadedImageUrl(uploadedUrl);
        
    } catch (error) {
        console.error('❌ Upload failed:', error);
        Alert.alert('Lỗi', 'Không thể upload ảnh. Vui lòng thử lại.');
    }
};
```

## Styled Components

Component sử dụng StyleSheet với theme màu đỏ phù hợp với design system:
- **Primary Red**: `#DC2626`
- **Success Green**: `#16A34A` 
- **Background**: `rgba(0, 0, 0, 0.5)` cho overlay
- **Border**: `#FECACA` cho image container

## Error Handling

- **Camera permission denied**: Hiển thị UI thân thiện với nút retry
- **Image picker error**: Alert với thông báo lỗi
- **File processing error**: Log chi tiết cho debugging
- **Navigation error**: Fallback với goBack()

## Platform Support

- ✅ **iOS**: Full support với camera và image picker
- ✅ **Android**: Full support với camera và image picker
- ❌ **Web**: Camera không support, chỉ image picker

## Notes

1. **Performance**: Ảnh được compress với quality 0.8 để tối ưu kích thước
2. **Security**: Validate file type và kích thước trước upload
3. **UX**: StatusBar được ẩn trong camera mode để có trải nghiệm immersive
4. **File naming**: Auto generate tên file với timestamp để tránh trùng lặp

## Example Implementation

Xem `CoachAttendanceFormScreen.tsx` để thấy implementation đầy đủ của PhotoCaptureScreen với:
- State management cho selected image
- Validation trước khi submit
- UI hiển thị ảnh đã chọn
- Integration với upload workflow