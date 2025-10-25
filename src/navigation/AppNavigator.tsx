import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, MainTabParamList } from '../types';

// Import screens
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import MyPetsScreen from '../screens/pets/MyPetsScreen';
import AddEditPetScreen from '../screens/pets/AddEditPetScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

// Placeholder screens for other tabs
const HomeScreen = () => null;
const SearchScreen = () => null;
const BookingsScreen = () => null;

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            headerShown: true,
            title: 'Profile',
          }}
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="MyPets" 
          component={MyPetsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="AddEditPet" 
          component={AddEditPetScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            headerShown: false,
          }}
        />
        {/* Placeholder screens for other routes */}
        <Stack.Screen 
          name="Notifications" 
          component={() => null}
          options={{
            headerShown: true,
            title: 'Notifications',
          }}
        />
        <Stack.Screen 
          name="HelpCenter" 
          component={() => null}
          options={{
            headerShown: true,
            title: 'Help Center',
          }}
        />
        <Stack.Screen 
          name="ContactSupport" 
          component={() => null}
          options={{
            headerShown: true,
            title: 'Contact Support',
          }}
        />
        <Stack.Screen 
          name="TermsOfService" 
          component={() => null}
          options={{
            headerShown: true,
            title: 'Terms of Service',
          }}
        />
        <Stack.Screen 
          name="PrivacyPolicy" 
          component={() => null}
          options={{
            headerShown: true,
            title: 'Privacy Policy',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
