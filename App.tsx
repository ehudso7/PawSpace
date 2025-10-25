import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { useAuth } from './src/hooks/useAuth';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignupScreen } from './src/screens/auth/SignupScreen';
import { OnboardingScreen, shouldShowOnboarding } from './src/screens/auth/OnboardingScreen';

const Stack = createStackNavigator();

// Placeholder for your main app screens
const MainApp = () => {
  return (
    <View style={styles.mainApp}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default function App() {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const shouldShow = await shouldShowOnboarding();
      setShowOnboarding(shouldShow);
    };

    checkOnboarding();
  }, []);

  // Show loading screen while checking auth state and onboarding status
  if (loading || showOnboarding === null) {
    return (
      <PaperProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
        <StatusBar style="auto" />
      </PaperProvider>
    );
  }

  // Show onboarding if user hasn't seen it yet
  if (showOnboarding && !user) {
    return (
      <PaperProvider>
        <OnboardingScreen
          navigation={null}
          onComplete={() => setShowOnboarding(false)}
        />
        <StatusBar style="auto" />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        {user ? (
          // User is authenticated - show main app
          <MainApp />
        ) : (
          // User is not authenticated - show auth screens
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  mainApp: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});