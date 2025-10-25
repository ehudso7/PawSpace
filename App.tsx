import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';
import { useColorScheme } from 'react-native';
import * as Sentry from 'sentry-expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';
import { AnalyticsProvider } from './src/services/analytics';
import { NotificationProvider } from './src/services/notifications';

Sentry.init({
  dsn: Constants.expoConfig?.extra?.sentryDsn,
  enableInExpoDevelopment: true,
  debug: __DEV__,
});

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function AppInner() {
  const scheme = useColorScheme();
  useEffect(() => {
    // Any async setup can run here
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <AnalyticsProvider>
        <NotificationProvider>
          <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator />
          </NavigationContainer>
        </NotificationProvider>
      </AnalyticsProvider>
    </SafeAreaProvider>
  );
}

export default Sentry.Native.wrap(AppInner);
