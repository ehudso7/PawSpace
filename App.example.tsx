/**
 * Example Navigation Setup for PawSpace Auth
 * 
 * This file demonstrates how to integrate the authentication screens
 * with React Navigation and handle auth state changes.
 * 
 * Install required packages:
 * npm install @react-navigation/native @react-navigation/native-stack
 * npm install react-native-screens react-native-safe-area-context
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// Import auth screens
import { OnboardingScreen, hasCompletedOnboarding } from './src/screens/auth/OnboardingScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignupScreen } from './src/screens/auth/SignupScreen';

// Import auth hook
import { useAuth } from './src/hooks/useAuth';

// Type definitions for navigation
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  // Add other screens here
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Auth Stack Navigator
 * Shows authentication-related screens
 */
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

/**
 * App Stack Navigator
 * Shows main app screens for authenticated users
 */
const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'PawSpace' }}
      />
      {/* Add other authenticated screens here */}
    </Stack.Navigator>
  );
};

/**
 * Placeholder Home Screen
 * Replace with your actual home screen
 */
const HomeScreen = () => {
  const { user, signOut } = useAuth();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {user?.profile.full_name}!</Text>
      <Text>Type: {user?.user_type}</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

/**
 * Root Navigator
 * Handles routing between auth and app stacks based on auth state
 */
const RootNavigator = () => {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await hasCompletedOnboarding();
      setShowOnboarding(!completed);
      setCheckingOnboarding(false);
    };

    checkOnboarding();
  }, []);

  // Show loading screen while checking auth state
  if (loading || checkingOnboarding) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // User is authenticated - show app screens
  if (user) {
    return <AppStack />;
  }

  // User is not authenticated
  // Show onboarding for first-time users, otherwise show auth screens
  if (showOnboarding) {
    return <AuthStack />;
  }

  // Return to login screen
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

/**
 * Main App Component
 * Wraps navigation in required providers
 */
export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * Alternative: Using a navigation ref for programmatic navigation
 * 
 * import { navigationRef } from './navigation/navigationRef';
 * 
 * <NavigationContainer ref={navigationRef}>
 *   <RootNavigator />
 * </NavigationContainer>
 */
