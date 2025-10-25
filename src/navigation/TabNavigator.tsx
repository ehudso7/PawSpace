import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { 
  TabParamList, 
  HomeStackParamList, 
  BookStackParamList, 
  CreateStackParamList, 
  ProfileStackParamList 
} from '../types/navigation';

// Import screens (these would be created separately)
import FeedScreen from '../screens/home/FeedScreen';
import PostDetailScreen from '../screens/home/PostDetailScreen';
import UserProfileScreen from '../screens/home/UserProfileScreen';

import ServiceListScreen from '../screens/book/ServiceListScreen';
import ServiceDetailScreen from '../screens/book/ServiceDetailScreen';
import BookingFormScreen from '../screens/book/BookingFormScreen';
import BookingConfirmationScreen from '../screens/book/BookingConfirmationScreen';

import ImageSelectorScreen from '../screens/create/ImageSelectorScreen';
import PostEditorScreen from '../screens/create/PostEditorScreen';
import ServiceEditorScreen from '../screens/create/ServiceEditorScreen';

import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import MyBookingsScreen from '../screens/profile/MyBookingsScreen';
import MyServicesScreen from '../screens/profile/MyServicesScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

// Home Stack Navigator
const HomeStack = createStackNavigator<HomeStackParamList>();
const HomeStackNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#ffffff' },
    }}
  >
    <HomeStack.Screen name="FeedScreen" component={FeedScreen} />
    <HomeStack.Screen 
      name="PostDetail" 
      component={PostDetailScreen}
      options={{
        headerShown: true,
        title: 'Post Details',
        headerBackTitleVisible: false,
      }}
    />
    <HomeStack.Screen 
      name="UserProfile" 
      component={UserProfileScreen}
      options={{
        headerShown: true,
        title: 'Profile',
        headerBackTitleVisible: false,
      }}
    />
  </HomeStack.Navigator>
);

// Book Stack Navigator
const BookStack = createStackNavigator<BookStackParamList>();
const BookStackNavigator = () => (
  <BookStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#ffffff' },
    }}
  >
    <BookStack.Screen name="ServiceListScreen" component={ServiceListScreen} />
    <BookStack.Screen 
      name="ServiceDetail" 
      component={ServiceDetailScreen}
      options={{
        headerShown: true,
        title: 'Service Details',
        headerBackTitleVisible: false,
      }}
    />
    <BookStack.Screen 
      name="BookingForm" 
      component={BookingFormScreen}
      options={{
        headerShown: true,
        title: 'Book Service',
        headerBackTitleVisible: false,
      }}
    />
    <BookStack.Screen 
      name="BookingConfirmation" 
      component={BookingConfirmationScreen}
      options={{
        headerShown: true,
        title: 'Booking Confirmed',
        headerBackTitleVisible: false,
        headerLeft: () => null, // Prevent going back
      }}
    />
  </BookStack.Navigator>
);

// Create Stack Navigator
const CreateStack = createStackNavigator<CreateStackParamList>();
const CreateStackNavigator = () => (
  <CreateStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#ffffff' },
    }}
  >
    <CreateStack.Screen name="ImageSelectorScreen" component={ImageSelectorScreen} />
    <CreateStack.Screen 
      name="PostEditor" 
      component={PostEditorScreen}
      options={{
        headerShown: true,
        title: 'Create Post',
        headerBackTitleVisible: false,
      }}
    />
    <CreateStack.Screen 
      name="ServiceEditor" 
      component={ServiceEditorScreen}
      options={{
        headerShown: true,
        title: 'Service Editor',
        headerBackTitleVisible: false,
      }}
    />
  </CreateStack.Navigator>
);

// Profile Stack Navigator
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#ffffff' },
    }}
  >
    <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
    <ProfileStack.Screen 
      name="EditProfile" 
      component={EditProfileScreen}
      options={{
        headerShown: true,
        title: 'Edit Profile',
        headerBackTitleVisible: false,
      }}
    />
    <ProfileStack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{
        headerShown: true,
        title: 'Settings',
        headerBackTitleVisible: false,
      }}
    />
    <ProfileStack.Screen 
      name="MyBookings" 
      component={MyBookingsScreen}
      options={{
        headerShown: true,
        title: 'My Bookings',
        headerBackTitleVisible: false,
      }}
    />
    <ProfileStack.Screen 
      name="MyServices" 
      component={MyServicesScreen}
      options={{
        headerShown: true,
        title: 'My Services',
        headerBackTitleVisible: false,
      }}
    />
    <ProfileStack.Screen 
      name="Notifications" 
      component={NotificationsScreen}
      options={{
        headerShown: true,
        title: 'Notifications',
        headerBackTitleVisible: false,
      }}
    />
  </ProfileStack.Navigator>
);

const TabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          paddingTop: 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#9e9e9e',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'HomeStack':
              iconName = 'home';
              break;
            case 'BookStack':
              iconName = 'event';
              break;
            case 'CreateStack':
              iconName = 'add-circle';
              break;
            case 'ProfileStack':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return (
            <Icon 
              name={iconName} 
              size={size || 24} 
              color={color} 
              style={styles.tabIcon}
            />
          );
        },
      })}
    >
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStackNavigator}
        options={{
          title: 'Home',
          tabBarTestID: 'home-tab',
        }}
      />
      <Tab.Screen 
        name="BookStack" 
        component={BookStackNavigator}
        options={{
          title: 'Book',
          tabBarTestID: 'book-tab',
        }}
      />
      <Tab.Screen 
        name="CreateStack" 
        component={CreateStackNavigator}
        options={{
          title: 'Create',
          tabBarTestID: 'create-tab',
        }}
      />
      <Tab.Screen 
        name="ProfileStack" 
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
          tabBarTestID: 'profile-tab',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    marginTop: 2,
  },
});

export default TabNavigator;