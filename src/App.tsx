import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from 'sentry-expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from '@/navigation/AppNavigator';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { navigationRef } from '@/navigation/NavigationService';
import { AnalyticsService } from '@/services/analytics';
import { notificationService } from '@/services/notifications';

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  enableInExpoDevelopment: true,
  debug: !!__DEV__,
});

const analytics = new AnalyticsService();

function App() {
  useEffect(() => {
    analytics.logScreenView('AppRoot');
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <Bootstrap />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function Bootstrap() {
  const { user } = useAuth();

  useEffect(() => {
    notificationService.setupNotificationHandlers();
  }, []);

  useEffect(() => {
    if (user?.id) {
      analytics.setUserId(user.id);
      notificationService.registerForPushNotifications(user.id).catch(() => {});
    }
  }, [user?.id]);

  return null;
}

// Export wrapped root for Sentry
// eslint-disable-next-line import/no-default-export
export default Sentry.Native.wrap(App);
