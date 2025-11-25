<div align="center">

# 🥋 Taekwondo Management App

### Ứng dụng quản lý câu lạc bộ Taekwondo toàn diện

[![React Native](https://img.shields.io/badge/React_Native-0.81.4-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.8.2-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

</div>

---

## 📋 Mục lục

- [Tổng quan dự án](#-tổng-quan-dự-án)
- [Tech Stack](#-tech-stack)
- [Tính năng chính](#-tính-năng-chính)
- [Bắt đầu](#-bắt-đầu)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Screenshots](#-screenshots)
- [Đóng góp](#-đóng-góp)

---

## 🎯 Tổng quan dự án

**Taekwondo Management App** là ứng dụng di động toàn diện được xây dựng bằng React Native và Expo, nhằm số hóa và tối ưu hóa quy trình quản lý câu lạc bộ Taekwondo. Ứng dụng cung cấp giải pháp quản lý học viên, điểm danh, đăng ký lớp học, và nhiều tính năng tiện ích khác dành cho huấn luyện viên và quản lý viên.

### ✨ Điểm nổi bật

- 🤖 **Nhận diện khuôn mặt AI** - Sử dụng ArcFace AI để nhận diện huấn luyện viên
- 📸 **Quét QR Code** - Điểm danh nhanh chóng bằng mã QR
- 📊 **Quản lý điểm GOAT Points** - Theo dõi và đánh giá học viên
- 🏢 **Multi-branch Support** - Quản lý nhiều chi nhánh
- 🌐 **Offline-first** - Sử dụng SQLite để lưu trữ dữ liệu cục bộ
- 🎨 **UI/UX hiện đại** - Giao diện thân thiện, dễ sử dụng

---

## 🛠 Tech Stack

### Core Framework
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **React Native** | 0.81.4 | Framework chính cho mobile app |
| **Expo** | 54.0.0 | Nền tảng phát triển và build |
| **TypeScript** | 5.9.2 | Type safety và developer experience |

### State Management & Data Fetching
| Công nghệ | Mô tả |
|-----------|-------|
| **Redux Toolkit** | Quản lý state toàn cục (features, quick access) |
| **React Query** | Server state management và caching |
| **Expo SQLite** | Local database cho offline-first approach |
| **AsyncStorage** | Persistent storage cho user preferences |

### Navigation & Layout
| Công nghệ | Mô tả |
|-----------|-------|
| **React Navigation** | Navigation framework chính |
| **Bottom Tabs Navigator** | Tab navigation (Home, Features, Scan, Notification, Profile) |
| **Stack Navigator** | Screen navigation trong các module |
| **Safe Area Context** | Xử lý safe area cho các thiết bị khác nhau |

### UI Components & Styling
| Công nghệ | Mô tả |
|-----------|-------|
| **Lucide React Native** | Icon library hiện đại |
| **Expo Vector Icons** | Icon bổ sung |
| **Linear Gradient** | Gradient effects |
| **React Native Modal** | Modal components |
| **SASS/SCSS** | CSS preprocessor cho styling nâng cao |
| **Bottom Sheet** | Interactive bottom sheet component |

### Camera & Media
| Công nghệ | Mô tả |
|-----------|-------|
| **Expo Camera** | Camera access và face recognition |
| **Expo Barcode Scanner** | QR code scanning |
| **Expo Image Picker** | Photo selection từ gallery |
| **Expo Image Manipulator** | Image processing và optimization |
| **Bytescale Upload Widget** | Cloud image upload |

### Form & Date Handling
| Công nghệ | Mô tả |
|-----------|-------|
| **React Native Dropdown Picker** | Dropdown selection |
| **React Native Modal DateTime Picker** | Date/time selection |
| **date-fns** | Date manipulation và formatting |
| **dayjs** | Lightweight date library |

### API & Networking
| Công nghệ | Mô tả |
|-----------|-------|
| **Axios** | HTTP client cho API calls |
| **React Native Dotenv** | Environment variables management |

### Performance & Animations
| Công nghệ | Mô tả |
|-----------|-------|
| **React Native Reanimated** | Smooth animations |
| **React Native Gesture Handler** | Gesture handling |
| **React Native Super Grid** | Optimized grid layouts |

---

## 🎨 Tính năng chính

### 🏠 Trang chủ (Home Screen)
- Dashboard tổng quan hoạt động
- Quick access đến các tính năng thường dùng
- Thông tin lớp học và lịch trình

### 🔐 Xác thực (Authentication)
- Đăng nhập/Đăng xuất an toàn
- Quản lý phiên làm việc
- Role-based access control (Admin, Coach, Staff)

### 👥 Quản lý học viên
- **Danh sách học viên theo chi nhánh**
  - Xem thông tin chi tiết học viên
  - Tìm kiếm và lọc học viên
  - Quản lý hồ sơ và cấp đai
- **Đăng ký học viên mới**
  - Form đăng ký đầy đủ thông tin
  - Upload ảnh học viên
  - Gán vào lớp học phù hợp

### 📝 Điểm danh (Attendance)
- **Điểm danh học viên**
  - Điểm danh theo buổi học
  - Quét QR code nhanh chóng
  - Ghi chú trạng thái tham gia
- **Điểm danh học thử**
  - Quản lý học viên học thử
  - Tracking conversion rate
- **Điểm danh huấn luyện viên**
  - Theo dõi giờ làm việc của HLV
  - Báo cáo chuyên cần

### 🏆 GOAT Points System
- **Tổng quan điểm**
  - Dashboard điểm tổng hợp
  - Xếp hạng học viên
- **Điểm danh (Attendance Points)**
  - Tự động tích điểm khi điểm danh
  - Bonus điểm cho chuyên cần
- **Điểm thời gian (Time-based Points)**
  - Tích điểm theo thời gian tập luyện
  - Milestone rewards
- **Báo cáo điểm**
  - Xuất báo cáo chi tiết
  - Phân tích xu hướng

### 📋 Đăng ký lớp học (Enrollment)
- Đăng ký học viên vào lớp
- Quản lý danh sách lớp học
- Chọn buổi học phù hợp
- Modal lựa chọn session linh hoạt

### 🏢 Quản lý chi nhánh (Branch Management)
- Xem danh sách chi nhánh
- Chuyển đổi giữa các chi nhánh
- Quản lý thông tin chi nhánh

### 🤖 Nhận diện AI (ArcFace AI)
- **Nhận diện khuôn mặt huấn luyện viên**
  - Sử dụng thuật toán ArcFace
  - Real-time scanning với interval 5 giây
  - Tự động dừng khi nhận diện thành công
  - Độ chính xác cao (threshold 70%)
- **Chụp ảnh học viên**
  - Camera interface thân thiện
  - Photo preview và crop
  - Upload lên cloud storage

### 📲 Quét QR Code (Scan Screen)
- Quét mã QR điểm danh
- Tích hợp camera với permissions
- Real-time scanning feedback

### 🔔 Thông báo (Notifications)
- Thông báo sự kiện
- Nhắc nhở lịch học
- Cập nhật từ hệ thống

### 👤 Hồ sơ cá nhân (Profile)
- Thông tin tài khoản
- Cài đặt ứng dụng
- Đăng xuất

### 🎯 Tiện ích nhanh (Quick Access)
- Customizable quick access menu
- Drag-and-drop để sắp xếp
- Lưu preferences local

### 📄 Yêu cầu nghỉ học (Leave Request)
- Gửi đơn xin nghỉ
- Theo dõi trạng thái đơn
- Lịch sử nghỉ học

---

## 🚀 Bắt đầu

### Yêu cầu môi trường

- **Node.js**: >= 18.x
- **npm** hoặc **yarn**
- **Expo Go App**: Cài đặt trên điện thoại (Android/iOS) và kết nối chung mạng Wi-Fi (hoặc dùng 4G nếu chạy qua Tunnel).

### Cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Cài đặt dependencies**
```bash
npm install
# hoặc
yarn install
```

3. **Cấu hình environment variables**

Tạo file `.env` trong thư mục gốc:
```env
# URL API Backend (Lấy từ Ngrok)
EXPO_PUBLIC_API_URL=[https://xxxx-xxxx-xxxx.ngrok-free.app](https://xxxx-xxxx-xxxx.ngrok-free.app)

EXPO_PUBLIC_API_TIMEOUT=10000
EXPO_PUBLIC_APP_ENV=development

# Bytescale Config (Upload ảnh)
EXPO_PUBLIC_BYTESCALE_ACCOUNT_ID=kW2K8fv
EXPO_PUBLIC_BYTESCALE_PUBLIC_KEY=public_kW2K8fv2gqYS2iGNEqMatPwsuqon
```

4. **Khởi động ứng dụng**
Sử dụng cờ -c để xóa cache (bắt buộc khi vừa đổi file .env):
```bash
npx expo start -c
```

5. **Chạy trên thiết bị**

Sau khi development server khởi động, bạn có thể:

Terminal sẽ hiện ra một mã QR.

Nhấn phím s trong terminal để chuyển sang chế độ Expo Go (nếu chưa mặc định).

Mở app Expo Go trên điện thoại:

* Android: Quét mã QR trực tiếp từ app Expo Go.

* iOS: Mở Camera mặc định, quét mã QR để mở trong Expo Go.

### Build Production

**Sử dụng EAS (Expo Application Services)**

1. **Cài đặt EAS CLI** (nếu chưa có)
```bash
npm install -g eas-cli
```

2. **Login vào Expo account**
```bash
eas login
```

3. **Build cho Android**
```bash
eas build --platform android
```

4. **Build cho iOS**
```bash
eas build --platform ios
```

5. **Build cho cả hai platform**
```bash
eas build --platform all
```

---

## 📁 Cấu trúc thư mục

```
frontend-python-project/
│
├── 📱 src/                          # Source code chính
│   ├── 🎨 App.tsx                   # Root component
│   │
│   ├── 🔌 api/                      # API configuration
│   │   ├── axiosInstance.ts         # Main API instance
│   │   ├── axiosInstanceAI.ts       # AI API instance
│   │   └── endpoints.ts             # API endpoints definition
│   │
│   ├── 🧩 components/               # Reusable components
│   │   ├── common/                  # Common UI components
│   │   │   ├── CustomButton.tsx     # Button component
│   │   │   ├── Dropdown.tsx         # Dropdown selector
│   │   │   └── SearchBar.tsx        # Search input
│   │   └── layout/                  # Layout components
│   │       ├── Divider.tsx          # Divider line
│   │       └── HeaderApp/           # Header components
│   │
│   ├── 🎯 screens/                  # Application screens
│   │   ├── AuthScreen/              # Authentication screens
│   │   │   ├── SignInScreen.tsx
│   │   │   └── LoadingScreen.tsx
│   │   ├── HomeScreen/              # Home dashboard
│   │   ├── FeaturesScreen/          # Features menu
│   │   ├── BranchScreen/            # Branch management
│   │   │   └── StudentListScreen/   # Student list by branch
│   │   ├── EnrollmentScreen/        # Student enrollment
│   │   ├── StudentAttendanceScreen/ # Student attendance
│   │   ├── TrialAttendanceScreen/   # Trial student attendance
│   │   ├── CoachAttendanceScreen/   # Coach attendance
│   │   ├── GOATPointsScreen/        # GOAT Points management
│   │   │   ├── GOATPointsOverview.tsx
│   │   │   ├── GOATPointsAttendanceScreen/
│   │   │   ├── GOATPointsTimeScreen.tsx
│   │   │   └── GOATPointsScoresReport.tsx
│   │   ├── LeaveRequestScreen/      # Leave request management
│   │   ├── ScanScreen/              # QR Code scanning
│   │   ├── NotificationScreen/      # Notifications
│   │   ├── ProfileScreen/           # User profile
│   │   ├── LoadingScreen.tsx        # Loading state
│   │   └── NotFoundScreen.tsx       # 404 screen
│   │
│   ├── 🧭 navigation/               # Navigation configuration
│   │   ├── AppNavigator.tsx         # Main app navigator
│   │   ├── AuthNavigator.tsx        # Auth flow navigator
│   │   ├── TabNavigator.tsx         # Bottom tab navigator
│   │   └── FeatureNavigator.ts      # Feature navigation helpers
│   │
│   ├── 🔧 services/                 # Business logic & API calls
│   │   ├── auth/                    # Authentication services
│   │   ├── attendance/              # Attendance services
│   │   ├── training/                # Training session services
│   │   ├── ai/                      # AI recognition services
│   │   ├── upload/                  # File upload services
│   │   ├── featureService.ts        # Feature management
│   │   ├── registrationService.ts   # Registration services
│   │   └── summary.ts               # Summary & statistics
│   │
│   ├── 🗂 store/                    # Redux store
│   │   ├── features/                # Feature slice
│   │   └── quickAccess/             # Quick access slice
│   │
│   ├── 🎣 hooks/                    # Custom React hooks
│   │   ├── useBranches.ts           # Branch data hook
│   │   ├── useClassSessions.ts      # Class session hook
│   │   └── useStudents.ts           # Student data hook
│   │
│   ├── 🔐 providers/                # Context providers
│   │   ├── AuthProvider.tsx         # Authentication context
│   │   ├── DatabaseProvider.tsx     # SQLite database context
│   │   └── index.ts                 # Provider exports
│   │
│   ├── 📐 types/                    # TypeScript type definitions
│   │   ├── types.ts                 # Common types
│   │   ├── FeatureTypes.ts          # Feature types
│   │   ├── RegistrationTypes.ts     # Registration types
│   │   ├── Auth/                    # Auth types
│   │   ├── attendance/              # Attendance types
│   │   └── training/                # Training types
│   │
│   ├── 🛠 utils/                    # Utility functions
│   │   ├── dateUtils.ts             # Date formatting & manipulation
│   │   ├── format.ts                # Data formatting
│   │   ├── errorUtils.ts            # Error handling
│   │   ├── deviceInfo.ts            # Device information
│   │   ├── embeddingUtils.ts        # AI embedding utilities
│   │   ├── uploadToBytescale.ts     # Image upload helper
│   │   ├── loadingUtils.ts          # Loading state management
│   │   ├── userUtils.ts             # User-related utilities
│   │   └── fonts.ts                 # Font configuration
│   │
│   ├── 🎨 styles/                   # Global styles & themes
│   │   ├── global.scss              # Global SCSS styles
│   │   ├── gradients.tsx            # Gradient definitions
│   │   ├── beltLevel.ts             # Belt level colors
│   │   ├── colorTypes.ts            # Color palette
│   │   ├── weekDays.ts              # Week day constants
│   │   └── declarations.d.ts        # Style type declarations
│   │
│   ├── 🖼 assets/                   # Static assets (images, icons)
│   └── 🎯 constants/                # App constants
│
├── 📚 docs/                         # Documentation
│   ├── ArcFaceAIGuide.md           # AI recognition guide
│   ├── PhotoCaptureGuide.md        # Photo capture guide
│   └── QuickAccessGuide.md         # Quick access guide
│
├── 🖼 assets/                       # Root level assets
│   ├── taekwondo.jpg               # App icon
│   ├── splash-icon.png             # Splash screen
│   ├── adaptive-icon.png           # Android adaptive icon
│   └── favicon.png                 # Web favicon
│
├── ⚙️ Configuration Files
│   ├── app.json                    # Expo configuration
│   ├── eas.json                    # EAS Build configuration
│   ├── package.json                # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── babel.config.js             # Babel configuration
│   ├── metro.config.js             # Metro bundler configuration
│   └── index.ts                    # App entry point
│
└── 📖 README.md                     # Documentation (you are here!)
```

### 📂 Giải thích chi tiết các thư mục quan trọng

#### 🎯 `screens/`
Chứa tất cả các màn hình của ứng dụng. Mỗi feature có thư mục riêng với các màn hình liên quan:
- **Screen chính**: Hiển thị UI và xử lý user interaction
- **Header/Item components**: Component con cho từng màn hình
- **Form screens**: Màn hình nhập liệu và submit

#### 🔧 `services/`
Business logic layer - xử lý API calls và data transformation:
- Tách biệt logic nghiệp vụ khỏi UI
- Reusable functions cho nhiều screens
- Error handling tập trung

#### 🗂 `store/`
Redux Toolkit store cho global state:
- **features**: Quản lý feature list và permissions
- **quickAccess**: User's customized quick access menu

#### 🎣 `hooks/`
Custom hooks sử dụng React Query để fetch và cache data:
- Automatic caching và refetching
- Optimistic updates
- Error retry logic

#### 🔐 `providers/`
React Context providers cho app-wide state:
- **AuthProvider**: User authentication state
- **DatabaseProvider**: SQLite connection và migrations

---

## 📸 Screenshots

> 💡 **Chú ý**: Phần này đang được cập nhật. Vui lòng thêm screenshots của ứng dụng vào đây.

### 🏠 Màn hình chính

<div align="center">

| Đăng nhập | Trang chủ | Menu tính năng |
|:---------:|:---------:|:--------------:|
| ![Login]() | ![Home]() | ![Features]() |
| *Màn hình đăng nhập an toàn* | *Dashboard tổng quan* | *Menu tính năng đầy đủ* |

</div>

### 📝 Quản lý học viên & Điểm danh

<div align="center">

| Danh sách học viên | Điểm danh | GOAT Points |
|:------------------:|:---------:|:-----------:|
| ![Students]() | ![Attendance]() | ![Points]() |
| *Quản lý học viên theo chi nhánh* | *Điểm danh nhanh chóng* | *Hệ thống điểm thưởng* |

</div>

### 🤖 Công nghệ AI & QR

<div align="center">

| Nhận diện AI | Quét QR Code | Kết quả |
|:------------:|:------------:|:--------:|
| ![AI Recognition]() | ![QR Scan]() | ![Result]() |
| *ArcFace AI Recognition* | *QR Code Scanner* | *Kết quả tức thì* |

</div>

### 👤 Hồ sơ & Thông báo

<div align="center">

| Thông báo | Hồ sơ cá nhân |
|:---------:|:-------------:|
| ![Notifications]() | ![Profile]() |
| *Thông báo real-time* | *Quản lý tài khoản* |

</div>

---

## 🤝 Đóng góp

Chúng tôi luôn chào đón mọi đóng góp từ cộng đồng! 

### Cách đóng góp:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Style Guidelines:

- Sử dụng TypeScript cho type safety
- Follow React Native best practices
- Viết comments rõ ràng cho code phức tạp
- Đặt tên biến/function có ý nghĩa
- Component functional với hooks thay vì class component

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Liên hệ & Hỗ trợ

- **Developer**: Dat Nguyen Trung
- **Expo Project**: [@datnguyentrung/taekwondo-app](https://expo.dev/@datnguyentrung/taekwondo-app)
- **Package**: `com.datnguyentrung.frontendproject`

---

<div align="center">

### 🥋 Được xây dựng với ❤️ bởi đội ngũ phát triển

**Made for Taekwondo clubs, by developers who care about martial arts education**

</div>
