import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import * as Sentry from 'sentry-expo';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './src/navigation/navigationRef';
import RootNavigator from './src/navigation';
import { AnalyticsService } from './src/services/analytics';
import { NotificationService } from './src/services/notifications';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  enableInExpoDevelopment: true,
  debug: __DEV__,
});

const Stack = createNativeStackNavigator();

function AppInner() {
  const analytics = useRef(new AnalyticsService()).current;
  const notifications = useRef(new NotificationService()).current;

  useEffect(() => {
    notifications.setupNotificationHandlers();
    notifications.registerForPushNotifications().catch((error) => {
      Sentry.Native.captureException(error);
    });
  }, [notifications]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          analytics.logScreenView('Profile');
        }}
        onStateChange={async () => {
          const currentRoute = navigationRef.getCurrentRoute();
          if (currentRoute) {
            analytics.logScreenView(currentRoute.name);
          }
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default Sentry.Native.wrap(AppInner);
