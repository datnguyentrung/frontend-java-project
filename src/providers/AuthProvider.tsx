import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, AuthProviderProps, User } from '@/types/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            // Simulate loading time for better UX
            await new Promise(resolve => setTimeout(resolve, 2000));

            const userData = await AsyncStorage.getItem('user_credentials');
            const tokenData = await AsyncStorage.getItem('access_token');

            if (userData) {
                const parsedUser = JSON.parse(userData);
                if (parsedUser.user_id && parsedUser.user_password) {
                    setUser(parsedUser);
                    setAccessToken(tokenData);
                    setIsAuthenticated(true);
                } else {
                    // Invalid data, clear storage
                    await AsyncStorage.removeItem('user_credentials');
                    await AsyncStorage.removeItem('access_token');
                    await AsyncStorage.removeItem('refresh_token');
                    setIsAuthenticated(false);
                    setUser(null);
                    setAccessToken(null);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
                setAccessToken(null);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (userData: User) => {
        try {
            // Lưu user credentials
            await AsyncStorage.setItem('user_credentials', JSON.stringify(userData));

            // Nếu có access_token từ API response, lưu luôn
            if (userData.access_token) {
                await AsyncStorage.setItem('access_token', userData.access_token);
                setAccessToken(userData.access_token);
            }

            // Nếu có refresh_token, lưu luôn
            if (userData.refresh_token) {
                await AsyncStorage.setItem('refresh_token', userData.refresh_token);
            }

            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            // Clear tất cả data liên quan
            await AsyncStorage.removeItem('user_credentials');
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('refresh_token');

            setUser(null);
            setAccessToken(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const updateTokens = async (newAccessToken: string, newRefreshToken?: string) => {
        try {
            await AsyncStorage.setItem('access_token', newAccessToken);
            setAccessToken(newAccessToken);

            if (newRefreshToken) {
                await AsyncStorage.setItem('refresh_token', newRefreshToken);
            }
        } catch (error) {
            console.error('Error updating tokens:', error);
            throw error;
        }
    };

    const getAccessToken = async (): Promise<string | null> => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            return token;
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const value: AuthContextType = {
        isAuthenticated,
        userInfo: user?.info || null,
        user,
        access_token: accessToken,
        isLoading,
        signIn,
        signOut,
        checkAuthStatus,
        updateTokens,
        getAccessToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};