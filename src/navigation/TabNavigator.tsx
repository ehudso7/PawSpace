import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { 
  TabParamList, 
  HomeStackParamList, 
  BookStackParamList, 
  CreateStackParamList, 
  ProfileStackParamList 
} from '../types/navigation';

// Import screens
import FeedScreen from '../screens/tabs/FeedScreen';
import PostDetailScreen from '../screens/tabs/PostDetailScreen';
import UserProfileScreen from '../screens/tabs/UserProfileScreen';
import ServiceListScreen from '../screens/tabs/ServiceListScreen';
import ServiceDetailScreen from '../screens/tabs/ServiceDetailScreen';
import BookingScreen from '../screens/tabs/BookingScreen';
import BookingConfirmationScreen from '../screens/tabs/BookingConfirmationScreen';
import ImageSelectorScreen from '../screens/tabs/ImageSelectorScreen';
import PostComposerScreen from '../screens/tabs/PostComposerScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';
import EditProfileScreen from '../screens/tabs/EditProfileScreen';
import SettingsScreen from '../screens/tabs/SettingsScreen';
import MyBookingsScreen from '../screens/tabs/MyBookingsScreen';
import MyPetsScreen from '../screens/tabs/MyPetsScreen';

// Create stack navigators for each tab
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const BookStack = createNativeStackNavigator<BookStackParamList>();
const CreateStack = createNativeStackNavigator<CreateStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Home Stack Navigator
const HomeStackNavigator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <HomeStack.Screen 
        name="Feed" 
        component={FeedScreen}
        options={{
          title: 'PawSpace',
          headerLargeTitle: Platform.OS === 'ios',
        }}
      />
      <HomeStack.Screen 
        name="PostDetail" 
        component={PostDetailScreen}
        options={{
          title: 'Post',
          headerBackTitle: 'Back',
        }}
      />
      <HomeStack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{
          title: 'Profile',
          headerBackTitle: 'Back',
        }}
      />
    </HomeStack.Navigator>
  );
};

// Book Stack Navigator
const BookStackNavigator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <BookStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <BookStack.Screen 
        name="ServiceList" 
        component={ServiceListScreen}
        options={{
          title: 'Services',
          headerLargeTitle: Platform.OS === 'ios',
        }}
      />
      <BookStack.Screen 
        name="ServiceDetail" 
        component={ServiceDetailScreen}
        options={{
          title: 'Service Details',
          headerBackTitle: 'Back',
        }}
      />
      <BookStack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{
          title: 'Book Service',
          headerBackTitle: 'Back',
        }}
      />
      <BookStack.Screen 
        name="BookingConfirmation" 
        component={BookingConfirmationScreen}
        options={{
          title: 'Booking Confirmed',
          headerBackTitle: 'Back',
          gestureEnabled: false,
        }}
      />
    </BookStack.Navigator>
  );
};

// Create Stack Navigator
const CreateStackNavigator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <CreateStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <CreateStack.Screen 
        name="ImageSelector" 
        component={ImageSelectorScreen}
        options={{
          title: 'Create Post',
          headerLargeTitle: Platform.OS === 'ios',
        }}
      />
      <CreateStack.Screen 
        name="PostComposer" 
        component={PostComposerScreen}
        options={{
          title: 'New Post',
          headerBackTitle: 'Back',
        }}
      />
    </CreateStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <ProfileStack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          headerLargeTitle: Platform.OS === 'ios',
        }}
      />
      <ProfileStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          headerBackTitle: 'Back',
        }}
      />
      <ProfileStack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerBackTitle: 'Back',
        }}
      />
      <ProfileStack.Screen 
        name="MyBookings" 
        component={MyBookingsScreen}
        options={{
          title: 'My Bookings',
          headerBackTitle: 'Back',
        }}
      />
      <ProfileStack.Screen 
        name="MyPets" 
        component={MyPetsScreen}
        options={{
          title: 'My Pets',
          headerBackTitle: 'Back',
        }}
      />
    </ProfileStack.Navigator>
  );
};

// Main Tab Navigator
const TabNavigator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
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
            default:
              iconName = 'help-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: '#E5E5EA',
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          paddingTop: 5,
          height: Platform.OS === 'ios' ? 85 : 60,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="BookTab" 
        component={BookStackNavigator}
        options={{
          tabBarLabel: 'Book',
        }}
      />
      <Tab.Screen 
        name="CreateTab" 
        component={CreateStackNavigator}
        options={{
          tabBarLabel: 'Create',
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
