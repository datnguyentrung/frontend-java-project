import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import component TabNavigator
import TabNavigator from './navigation/TabNavigator';
// Import DatabaseProvider
import { DatabaseProvider } from './providers';

/**
 * App Component - Component gốc của ứng dụng
 * 
 * Cấu trúc:
 * - SafeAreaProvider: Đảm bảo app hiển thị đúng trong safe area của thiết bị
 * - DatabaseProvider: Quản lý database connection cho toàn app
 * - NavigationContainer: Container chính cho React Navigation
 * - TabNavigator: Component quản lý thanh điều hướng dưới cùng
 * - StatusBar: Thanh trạng thái của hệ thống
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        {/* NavigationContainer là container chính cho tất cả navigation */}
        <NavigationContainer>
          {/* TabNavigator quản lý các tab ở dưới cùng */}
          <TabNavigator />

          {/* StatusBar cấu hình thanh trạng thái để nội dung có thể tràn lên */}
          <StatusBar
            style="light"
            backgroundColor="transparent"
            translucent={true}
          />
        </NavigationContainer>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}
