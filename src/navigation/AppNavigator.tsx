import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
<<<<<<< HEAD
import { useAuth } from '@/hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // TODO: Add loading screen component
    return null;
=======
<<<<<<< HEAD
import { useAuth } from '@/hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
=======
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
>>>>>>> origin/main

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
<<<<<<< HEAD
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
>>>>>>> origin/main
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
<<<<<<< HEAD
=======
=======
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={TabNavigator} />
>>>>>>> origin/main
>>>>>>> origin/main
      </Stack.Navigator>
    </NavigationContainer>
  );
};

<<<<<<< HEAD
export default AppNavigator;
=======
<<<<<<< HEAD
export default AppNavigator;
=======
export default AppNavigator;
>>>>>>> origin/main
>>>>>>> origin/main
