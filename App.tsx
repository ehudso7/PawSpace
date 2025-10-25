import React, { useEffect } from 'react';
import { Platform, LogBox } from 'react-native';
import * as Sentry from 'sentry-expo';
import * as Notifications from 'expo-notifications';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from '@/context/AuthContext';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';
import MyPetsScreen from '@/screens/pets/MyPetsScreen';
import PetModal from '@/screens/pets/PetModal';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import { NotificationService } from '@/services/notifications';
import { AnalyticsService } from '@/services/analytics';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

Sentry.init({
  dsn: (require('./app.json').expo.extra.SENTRY_DSN || ''),
  enableInExpoDevelopment: true,
  debug: __DEV__,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Profile" component={ProfileScreen} />
      <Tabs.Screen name="MyPets" component={MyPetsScreen} options={{ title: 'Pets' }} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="PetModal" component={PetModal} options={{ presentation: 'modal', title: 'Pet' }} />
    </Stack.Navigator>
  );
}

function App() {
  useEffect(() => {
    const notificationService = new NotificationService();
    notificationService.setupNotificationHandlers();
    notificationService.registerForPushNotifications().catch(() => {});

    const analytics = new AnalyticsService();
    analytics.logEvent('app_opened', { platform: Platform.OS });
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default Sentry.Native.wrap(App);
