<<<<<<< HEAD
import { registerRootComponent } from 'expo';
import { AppNavigator } from './src/navigation';

// Register the main component
registerRootComponent(AppNavigator);
=======
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from '@/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
>>>>>>> origin/main
