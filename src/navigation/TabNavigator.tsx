import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import type {
  TabParamList,
  HomeStackParamList,
  BookStackParamList,
  CreateStackParamList,
  ProfileStackParamList,
} from '../types/navigation';

import FeedScreen from '../screens/tabs/home/FeedScreen';
import PostDetailsScreen from '../screens/tabs/home/PostDetailsScreen';

import ServiceListScreen from '../screens/tabs/book/ServiceListScreen';
import ServiceDetailsScreen from '../screens/tabs/book/ServiceDetailsScreen';
import BookingCheckoutScreen from '../screens/tabs/book/BookingCheckoutScreen';

import ImageSelectorScreen from '../screens/tabs/create/ImageSelectorScreen';
import CreatePostScreen from '../screens/tabs/create/CreatePostScreen';

import ProfileScreen from '../screens/tabs/profile/ProfileScreen';
import EditProfileScreen from '../screens/tabs/profile/EditProfileScreen';
import SettingsScreen from '../screens/tabs/profile/SettingsScreen';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const BookStack = createNativeStackNavigator<BookStackParamList>();
const CreateStack = createNativeStackNavigator<CreateStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Feed" component={FeedScreen} options={{ title: 'Home' }} />
      <HomeStack.Screen name="PostDetails" component={PostDetailsScreen} options={{ title: 'Post' }} />
    </HomeStack.Navigator>
  );
}

function BookStackNavigator() {
  return (
    <BookStack.Navigator>
      <BookStack.Screen name="ServiceList" component={ServiceListScreen} options={{ title: 'Book' }} />
      <BookStack.Screen name="ServiceDetails" component={ServiceDetailsScreen} options={{ title: 'Service' }} />
      <BookStack.Screen name="BookingCheckout" component={BookingCheckoutScreen} options={{ title: 'Checkout' }} />
    </BookStack.Navigator>
  );
}

function CreateStackNavigator() {
  return (
    <CreateStack.Navigator>
      <CreateStack.Screen name="ImageSelector" component={ImageSelectorScreen} options={{ title: 'Create' }} />
      <CreateStack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'New Post' }} />
    </CreateStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </ProfileStack.Navigator>
  );
}

const TabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceDisabled,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: Platform.OS === 'ios' ? 0.5 : 0.2,
          borderTopColor: '#e0e0e0',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'circle-outline';
          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'newspaper-variant' : 'newspaper-variant-outline';
              break;
            case 'BookTab':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'CreateTab':
              iconName = focused ? 'plus-circle' : 'plus-circle-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'account' : 'account-outline';
              break;
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="BookTab"
        component={BookStackNavigator}
        options={{ tabBarLabel: 'Book' }}
      />
      <Tab.Screen
        name="CreateTab"
        component={CreateStackNavigator}
        options={{ tabBarLabel: 'Create' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
