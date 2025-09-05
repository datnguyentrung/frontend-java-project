import React from 'react';
import { useAuth } from '@providers/AuthProvider';
import LoadingScreen from '../screens/AuthScreen/LoadingScreen';
import SignInScreen from '../screens/AuthScreen/SignInScreen';
import AppNavigator from './AppNavigator';


export default function AuthNavigator() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return isAuthenticated ? <AppNavigator /> : <SignInScreen />;
}
