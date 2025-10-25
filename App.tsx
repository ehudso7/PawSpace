import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Sentry from 'sentry-expo';
import { StatusBar } from 'expo-status-bar';

// Services
import { errorTrackingService } from './src/services/errorTracking';
import { analyticsService } from './src/services/analytics';
import { notificationService } from './src/services/notifications';

// Screens
import { ProfileScreen } from './src/screens/profile/ProfileScreen';
import { EditProfileScreen } from './src/screens/profile/EditProfileScreen';
import { MyPetsScreen } from './src/screens/pets/MyPetsScreen';
import { SettingsScreen } from './src/screens/settings/SettingsScreen';

// Placeholder screens for navigation
const HomeScreen = () => null;
const SearchScreen = () => null;
const CameraScreen = () => null;
const NotificationsScreen = () => null;

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Initialize error tracking
errorTrackingService.init();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'circle';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function App() {
  useEffect(() => {
    // Initialize services
    const initializeApp = async () => {
      try {
        // Set up notification handlers
        notificationService.setupNotificationHandlers();
        
        // Register for push notifications
        await notificationService.registerForPushNotifications();
        
        // Set up analytics user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          analyticsService.setUserId(user.id);
          errorTrackingService.setUser({
            id: user.id,
            email: user.email,
          });
        }
      } catch (error) {
        errorTrackingService.captureException(error as Error, {
          context: 'App.initializeApp',
        });
      }
    };

    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
          options={{
            headerShown: true,
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="MyPets" 
          component={MyPetsScreen}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Wrap the app with Sentry for error tracking
export default Sentry.Native.wrap(App);