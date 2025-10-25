import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
<<<<<<< HEAD
import { OnboardingScreen, LoginScreen, SignupScreen } from '@/screens/auth';
import { AuthStackParamList } from '@/types/navigation';
=======
import { AuthStackParamList } from '@/types/navigation';
<<<<<<< HEAD
import LoginScreen from '@/screens/auth/LoginScreen';
import SignupScreen from '@/screens/auth/SignupScreen';
import OnboardingScreen from '@/screens/auth/OnboardingScreen';
>>>>>>> origin/main

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
<<<<<<< HEAD
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
=======
      screenOptions={{
        headerShown: false,
      }}
    >
=======
import OnboardingScreen from '@/screens/auth/OnboardingScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import SignupScreen from '@/screens/auth/SignupScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
>>>>>>> origin/main
>>>>>>> origin/main
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
<<<<<<< HEAD
};

export default AuthNavigator;
=======
<<<<<<< HEAD
};

export default AuthNavigator;
=======
};
>>>>>>> origin/main
>>>>>>> origin/main
