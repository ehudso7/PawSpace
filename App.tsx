import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from 'sentry-expo';

// Import screens
import ProfileScreen from './src/screens/profile/ProfileScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import MyPetsScreen from './src/screens/pets/MyPetsScreen';
import AddEditPetModal from './src/screens/pets/AddEditPetModal';
import SettingsScreen from './src/screens/settings/SettingsScreen';

// Import services
import ErrorTrackingService from './src/services/errorTracking';
import NotificationService from './src/services/notifications';

// Initialize error tracking
ErrorTrackingService.getInstance().initialize();

// Wrap the app with Sentry
const App = Sentry.Native.wrap(() => {
  const Stack = createStackNavigator();

  useEffect(() => {
    // Initialize notification handlers
    const notificationService = NotificationService.getInstance();
    notificationService.setupNotificationHandlers();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Profile"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
          <Stack.Screen 
            name="EditProfile" 
            component={EditProfileScreen}
            options={{ title: 'Edit Profile' }}
          />
          <Stack.Screen 
            name="MyPets" 
            component={MyPetsScreen}
            options={{ title: 'My Pets' }}
          />
          <Stack.Screen 
            name="AddEditPet" 
            component={AddEditPetModal}
            options={{ title: 'Add Pet' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
});

export default App;