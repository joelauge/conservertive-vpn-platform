import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Constants from 'expo-constants';

// Import screens
import AuthScreen from './src/screens/AuthScreen';
import MainApp from './src/screens/MainApp';

// Get the publishable key from environment
const publishableKey = Constants.expoConfig?.extra?.clerkPublishableKey || 
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 
  'pk_test_YOUR_CLERK_PUBLISHABLE_KEY_HERE';

export default function App() {
  // Check if Clerk is properly configured
  const isClerkConfigured = publishableKey && 
    !publishableKey.includes('YOUR_CLERK') && 
    !publishableKey.includes('Y2xlcmsuY29uc2VydmVydGl2ZS5jbyQ');

  if (!isClerkConfigured) {
    // Show setup screen if Clerk is not configured
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <AuthScreen />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          
          {/* Show auth screen if not signed in */}
          <SignedOut>
            <AuthScreen />
          </SignedOut>
          
          {/* Show main app if signed in */}
          <SignedIn>
            <MainApp />
          </SignedIn>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
