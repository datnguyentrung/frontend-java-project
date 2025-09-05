import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import AuthProvider và AuthNavigator
import { AuthProvider } from '@providers/AuthProvider';
import AuthNavigator from './navigation/AuthNavigator';
// Import DatabaseProvider
import { DatabaseProvider } from './providers';

/**
 * App Component - Component gốc của ứng dụng
 * 
 * Cấu trúc:
 * - SafeAreaProvider: Đảm bảo app hiển thị đúng trong safe area của thiết bị
 * - QueryClientProvider: Provider cho React Query
 * - AuthProvider: Quản lý authentication state cho toàn app
 * - DatabaseProvider: Quản lý database connection cho toàn app
 * - NavigationContainer: Container chính cho React Navigation
 * - AuthNavigator: Component quản lý authentication flow và main navigation
 * - StatusBar: Thanh trạng thái của hệ thống
 */
export default function App() {
  const queryClient = new QueryClient();
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DatabaseProvider>
            {/* NavigationContainer là container chính cho tất cả navigation */}
            <NavigationContainer>
              {/* AuthNavigator quản lý authentication flow */}
              <AuthNavigator />

              {/* StatusBar cấu hình thanh trạng thái để nội dung có thể tràn lên */}
              <StatusBar
                style="light"
                backgroundColor="transparent"
                translucent={true}
              />
            </NavigationContainer>
          </DatabaseProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}