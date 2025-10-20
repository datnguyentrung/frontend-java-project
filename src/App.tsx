import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import AuthProvider và AuthNavigator
import { AuthProvider } from '@providers/AuthProvider';
import AuthNavigator from './navigation/AuthNavigator';
// Import DatabaseProvider
import { DatabaseProvider, useDatabase } from './providers';

// Component để kiểm tra database status
const AppContent = () => {
  const { isReady, error } = useDatabase();

  // Show error nếu database failed
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 }}>
        <Text style={{ fontSize: 18, color: '#FF5252', textAlign: 'center', marginBottom: 10 }}>
          Database Error
        </Text>
        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <Text style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>
          App sẽ tự động thử lại...
        </Text>
      </View>
    );
  }

  // Show loading nếu database chưa ready
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#FF5252" />
        <Text style={{ fontSize: 16, color: '#666', marginTop: 16 }}>
          Đang khởi tạo database...
        </Text>
      </View>
    );
  }

  // Database ready - show main app
  return (
    <NavigationContainer>
      <AuthNavigator />
      <StatusBar
        style="light"
        backgroundColor="transparent"
        translucent={true}
      />
    </NavigationContainer>
  );
};

/**
 * App Component - Component gốc của ứng dụng
 * 
 * Cấu trúc:
 * - SafeAreaProvider: Đảm bảo app hiển thị đúng trong safe area của thiết bị
 * - QueryClientProvider: Provider cho React Query
 * - AuthProvider: Quản lý authentication state cho toàn app
 * - DatabaseProvider: Quản lý database connection cho toàn app (đã tự động migration)
 * - AppContent: Kiểm tra database status và hiển thị UI phù hợp
 */
export default function App() {
  const queryClient = new QueryClient();
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DatabaseProvider>
            <AppContent />
          </DatabaseProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}