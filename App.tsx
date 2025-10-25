<<<<<<< HEAD
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
=======
<<<<<<< HEAD
import { registerRootComponent } from 'expo';
import { AppNavigator } from './src/navigation';

// Register the main component
registerRootComponent(AppNavigator);
=======
import React from 'react';
import { StatusBar } from 'expo-status-bar';
>>>>>>> origin/main
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from '@/navigation';

export default function App() {
  return (
<<<<<<< HEAD
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
=======
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
>>>>>>> origin/main
>>>>>>> origin/main
