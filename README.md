# 🚀 App Tutorial React Native - Hướng dẫn cơ bản

Đây là một ứng dụng React Native cơ bản được tạo để học tập, bao gồm:
- ✅ Thanh điều hướng dưới cùng (Bottom Tab Navigation)
- ✅ Nhiều màn hình khác nhau
- ✅ Component tùy chỉnh có thể tái sử dụng
- ✅ File SCSS cho styling
- ✅ Chú thích chi tiết để học tập

## 📁 Cấu trúc thư mục

```
src/
├── App.tsx                     # Component gốc của app
├── screens/                    # Các màn hình chính
│   ├── HomeScreen.tsx         # Màn hình trang chủ
│   ├── ProfileScreen.tsx      # Màn hình hồ sơ
│   └── SettingsScreen.tsx     # Màn hình cài đặt
├── navigation/                 # Cấu hình điều hướng
│   └── TabNavigator.tsx       # Tab navigator cho bottom tabs
├── components/                 # Các component tái sử dụng
│   └── common/
│       └── CustomButton.tsx   # Component button tùy chỉnh
└── styles/                     # File styling
    └── global.scss            # Style tổng quát với SCSS
```

## 🔧 Cách chạy ứng dụng

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Chạy ứng dụng:**
   ```bash
   npm start
   ```

3. **Chọn platform:**
   - Nhấn `a` để chạy trên Android
   - Nhấn `i` để chạy trên iOS
   - Nhấn `w` để chạy trên web

## 📚 Giải thích các khái niệm

### 1. 🏠 App.tsx - Component gốc
- **NavigationContainer**: Container chính cho React Navigation
- **SafeAreaProvider**: Đảm bảo app hiển thị đúng trên các thiết bị
- **TabNavigator**: Quản lý thanh điều hướng dưới cùng

### 2. 🧭 TabNavigator.tsx - Điều hướng
- **createBottomTabNavigator**: Tạo bottom tab navigation
- **Tab.Screen**: Định nghĩa từng tab với icon và màn hình tương ứng
- **screenOptions**: Cấu hình giao diện cho tabs

### 3. 📱 Screens - Các màn hình
- **HomeScreen**: Màn hình chính với demo các button
- **ProfileScreen**: Màn hình hồ sơ cá nhân
- **SettingsScreen**: Màn hình cài đặt với scroll view

### 4. 🔧 CustomButton - Component tùy chỉnh
- **Props interface**: Định nghĩa kiểu dữ liệu cho props
- **Variant system**: Hệ thống màu sắc khác nhau (primary, secondary, warning)
- **Disabled state**: Trạng thái vô hiệu hóa

### 5. 🎨 SCSS - Styling
- **Variables**: Biến để tái sử dụng màu sắc, kích thước
- **Mixins**: Các function CSS có thể tái sử dụng
- **Global classes**: Các class tiện ích dùng chung

## 💡 Điểm cần lưu ý

### React Native vs Web CSS
React Native không hỗ trợ tất cả CSS properties. Một số khác biệt:
- Sử dụng `flexDirection` thay vì `flex-direction`
- Không có `margin: auto`, dùng `alignSelf: 'center'`
- Màu sắc phải là string: `'#007bff'` thay vì hex trực tiếp

### Navigation
- Mỗi Screen sẽ tự động nhận props `navigation` và `route`
- Có thể navigate giữa các màn hình bằng `navigation.navigate('ScreenName')`

### State Management
- App này chỉ sử dụng local state với useState
- Có thể mở rộng với Redux hoặc Context API cho state phức tạp hơn

## 🚀 Mở rộng ứng dụng

### Thêm màn hình mới:
1. Tạo file component mới trong `src/screens/`
2. Thêm vào `TabNavigator.tsx`
3. Cấu hình icon và options

### Thêm component:
1. Tạo trong `src/components/common/`
2. Export để sử dụng ở các màn hình khác

### Styling:
1. Cập nhật `global.scss` với variables mới
2. Tạo mixins cho các pattern thường dùng

## 📖 Tài liệu tham khảo

- [React Navigation](https://reactnavigation.org/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript với React Native](https://reactnative.dev/docs/typescript)

---

🎉 **Chúc bạn học tốt React Native!** 🎉
