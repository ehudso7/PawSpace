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
import FeedScreen from '../screens/main/FeedScreen';
import PostDetailScreen from '../screens/main/PostDetailScreen';
import ServiceListScreen from '../screens/main/ServiceListScreen';
import ServiceDetailScreen from '../screens/main/ServiceDetailScreen';
import ImageSelectorScreen from '../screens/main/ImageSelectorScreen';
import CreatePreviewScreen from '../screens/main/CreatePreviewScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const BookStack = createNativeStackNavigator<BookStackParamList>();
const CreateStack = createNativeStackNavigator<CreateStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Feed" component={FeedScreen} options={{ title: 'Home' }} />
      <HomeStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          title: 'Post',
          headerBackTitle: 'Back',
        }}
      />
    </HomeStack.Navigator>
  );
}

function BookStackNavigator() {
  return (
    <BookStack.Navigator>
      <BookStack.Screen name="ServiceList" component={ServiceListScreen} options={{ title: 'Book' }} />
      <BookStack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ title: 'Service' }}
      />
    </BookStack.Navigator>
  );
}

function CreateStackNavigator() {
  return (
    <CreateStack.Navigator>
      <CreateStack.Screen
        name="ImageSelector"
        component={ImageSelectorScreen}
        options={{ title: 'Create' }}
      />
      <CreateStack.Screen name="CreatePreview" component={CreatePreviewScreen} options={{ title: 'Preview' }} />
    </CreateStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </ProfileStack.Navigator>
  );
}

export default function TabNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: 'rgba(0,0,0,0.1)',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, string> = {
            HomeStack: 'home-variant',
            BookStack: 'calendar-month',
            CreateStack: 'plus-circle',
            ProfileStack: 'account-circle',
          };
          const name = iconMap[route.name] ?? 'circle';
          return <MaterialCommunityIcons name={name} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="BookStack"
        component={BookStackNavigator}
        options={{
          title: 'Book',
        }}
      />
      <Tab.Screen
        name="CreateStack"
        component={CreateStackNavigator}
        options={{
          title: 'Create',
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
