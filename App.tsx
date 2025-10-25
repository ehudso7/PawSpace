import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Sentry from 'sentry-expo';

import AppNavigator from './src/navigation/AppNavigator';
import { errorTrackingService } from './src/services/errorTracking';
import { analyticsService } from './src/services/analytics';
import { notificationService } from './src/services/notifications';

// Initialize Sentry
errorTrackingService.initialize();

export default function App() {
  useEffect(() => {
    // Initialize services
    const initializeServices = async () => {
      try {
        // Initialize analytics
        await analyticsService.initialize();
        
        // Register for push notifications
        await notificationService.registerForPushNotifications();
        
        // Setup notification handlers
        notificationService.setupNotificationHandlers(null); // Navigation will be set up later
        
        console.log('All services initialized successfully');
      } catch (error) {
        errorTrackingService.captureException(error as Error, 'App.initializeServices');
        console.error('Failed to initialize services:', error);
      }
    };

    initializeServices();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
