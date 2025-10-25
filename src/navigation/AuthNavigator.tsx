import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';

// Import auth screens (these would be created separately)
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#ffffff' },
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
        },
      }}
    >
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;