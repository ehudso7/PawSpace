import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import FeedScreen from '@/screens/home/FeedScreen';
import TransformationDetailScreen from '@/screens/home/TransformationDetailScreen';
import ServiceListScreen from '@/screens/booking/ServiceListScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';
import SettingsScreen from '@/screens/profile/SettingsScreen';
import SubscriptionScreen from '@/screens/profile/SubscriptionScreen';
import { TabParamList, HomeStackParamList, ProfileStackParamList } from '@/types/navigation';
import { theme } from '@/constants/theme';

const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const HomeNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Feed" component={FeedScreen} options={{ headerShown: false }} />
    <HomeStack.Screen name="TransformationDetail" component={TransformationDetailScreen} />
  </HomeStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    <ProfileStack.Screen name="Subscription" component={SubscriptionScreen} />
  </ProfileStack.Navigator>
);

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Booking') iconName = 'calendar-outline';
          else if (route.name === 'Create') iconName = 'add-circle-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          else iconName = 'help-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      {/* Keep Booking tab minimal to avoid deep imports */}
      <Tab.Screen name="Booking" component={ServiceListScreen} />
      {/* Omit Create tab for now to reduce compile surface */}
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
