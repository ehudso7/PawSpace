import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from './hooks/useAuth';
import { OnboardingScreen, isOnboardingCompleted } from './screens/auth/OnboardingScreen';
import { LoginScreen } from './screens/auth/LoginScreen';
import { SignupScreen } from './screens/auth/SignupScreen';
import { HomeScreen } from './screens/HomeScreen';

type AuthScreen = 'onboarding' | 'login' | 'signup' | 'home';

const theme = {
  colors: {
    primary: '#2E7D32',
    accent: '#4CAF50',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#212121',
    placeholder: '#757575',
    error: '#d32f2f',
  },
};

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('onboarding');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if onboarding has been completed
        const onboardingCompleted = await isOnboardingCompleted();
        
        if (onboardingCompleted) {
          // If user is authenticated, go to home, otherwise go to login
          setCurrentScreen(user ? 'home' : 'login');
        } else {
          setCurrentScreen('onboarding');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setCurrentScreen('login');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [user]);

  const handleOnboardingComplete = () => {
    setCurrentScreen(user ? 'home' : 'login');
  };

  const handleNavigateToSignup = () => {
    setCurrentScreen('signup');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('home');
  };

  const handleSignupSuccess = () => {
    setCurrentScreen('home');
  };

  const renderCurrentScreen = () => {
    if (isInitializing || loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case 'login':
        return (
          <LoginScreen
            onNavigateToSignup={handleNavigateToSignup}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'signup':
        return (
          <SignupScreen
            onNavigateToLogin={handleNavigateToLogin}
            onSignupSuccess={handleSignupSuccess}
          />
        );
      case 'home':
        return <HomeScreen />;
      default:
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        {renderCurrentScreen()}
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});

export default App;