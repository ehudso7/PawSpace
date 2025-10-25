import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
<<<<<<< HEAD
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { FeedScreen, TransformationDetailScreen } from '@/screens/home';
import { ServiceListScreen, ProviderProfileScreen, BookingCalendarScreen, BookingConfirmScreen, MyBookingsScreen } from '@/screens/booking';
import { ImageSelectorScreen, EditorScreen, PreviewScreen } from '@/screens/create';
import { ProfileScreen, EditProfileScreen, SettingsScreen, SubscriptionScreen } from '@/screens/profile';
import { TabParamList, HomeStackParamList, BookingStackParamList, CreateStackParamList, ProfileStackParamList } from '@/types/navigation';
import { theme } from '@/constants/theme';
=======
<<<<<<< HEAD
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabParamList, HomeStackParamList, BookingStackParamList, CreateStackParamList, ProfileStackParamList } from '@/types/navigation';
import FeedScreen from '@/screens/home/FeedScreen';
import TransformationDetailScreen from '@/screens/home/TransformationDetailScreen';
import ServiceListScreen from '@/screens/booking/ServiceListScreen';
import ProviderProfileScreen from '@/screens/booking/ProviderProfileScreen';
import BookingCalendarScreen from '@/screens/booking/BookingCalendarScreen';
import BookingConfirmScreen from '@/screens/booking/BookingConfirmScreen';
import MyBookingsScreen from '@/screens/booking/MyBookingsScreen';
import ImageSelectorScreen from '@/screens/create/ImageSelectorScreen';
import EditorScreen from '@/screens/create/EditorScreen';
import PreviewScreen from '@/screens/create/PreviewScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';
import SettingsScreen from '@/screens/profile/SettingsScreen';
import SubscriptionScreen from '@/screens/profile/SubscriptionScreen';
>>>>>>> origin/main

const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const BookingStack = createNativeStackNavigator<BookingStackParamList>();
const CreateStack = createNativeStackNavigator<CreateStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

<<<<<<< HEAD
const HomeNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Feed" component={FeedScreen} options={{ headerShown: false }} />
    <HomeStack.Screen name="TransformationDetail" component={TransformationDetailScreen} />
  </HomeStack.Navigator>
);

const BookingNavigator = () => (
  <BookingStack.Navigator>
    <BookingStack.Screen name="ServiceList" component={ServiceListScreen} options={{ headerShown: false }} />
    <BookingStack.Screen name="ProviderProfile" component={ProviderProfileScreen} />
    <BookingStack.Screen name="BookingCalendar" component={BookingCalendarScreen} />
    <BookingStack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
    <BookingStack.Screen name="MyBookings" component={MyBookingsScreen} />
  </BookingStack.Navigator>
);

const CreateNavigator = () => (
  <CreateStack.Navigator>
    <CreateStack.Screen name="ImageSelector" component={ImageSelectorScreen} options={{ headerShown: false }} />
    <CreateStack.Screen name="Editor" component={EditorScreen} />
    <CreateStack.Screen name="Preview" component={PreviewScreen} />
  </CreateStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    <ProfileStack.Screen name="Subscription" component={SubscriptionScreen} />
  </ProfileStack.Navigator>
);
=======
const HomeStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Feed" component={FeedScreen} options={{ title: 'Feed' }} />
      <HomeStack.Screen name="TransformationDetail" component={TransformationDetailScreen} options={{ title: 'Transformation' }} />
    </HomeStack.Navigator>
  );
};

const BookingStackNavigator: React.FC = () => {
  return (
    <BookingStack.Navigator>
      <BookingStack.Screen name="ServiceList" component={ServiceListScreen} options={{ title: 'Services' }} />
      <BookingStack.Screen name="ProviderProfile" component={ProviderProfileScreen} options={{ title: 'Provider' }} />
      <BookingStack.Screen name="BookingCalendar" component={BookingCalendarScreen} options={{ title: 'Select Date' }} />
      <BookingStack.Screen name="BookingConfirm" component={BookingConfirmScreen} options={{ title: 'Confirm Booking' }} />
      <BookingStack.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'My Bookings' }} />
    </BookingStack.Navigator>
  );
};

const CreateStackNavigator: React.FC = () => {
  return (
    <CreateStack.Navigator>
      <CreateStack.Screen name="ImageSelector" component={ImageSelectorScreen} options={{ title: 'Select Image' }} />
      <CreateStack.Screen name="Editor" component={EditorScreen} options={{ title: 'Edit' }} />
      <CreateStack.Screen name="Preview" component={PreviewScreen} options={{ title: 'Preview' }} />
    </CreateStack.Navigator>
  );
};

const ProfileStackNavigator: React.FC = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <ProfileStack.Screen name="Subscription" component={SubscriptionScreen} options={{ title: 'Subscription' }} />
    </ProfileStack.Navigator>
  );
};
>>>>>>> origin/main

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
<<<<<<< HEAD
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Booking') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Booking" component={BookingNavigator} />
      <Tab.Screen name="Create" component={CreateNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
=======
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="BookingTab" component={BookingStackNavigator} options={{ title: 'Book' }} />
      <Tab.Screen name="CreateTab" component={CreateStackNavigator} options={{ title: 'Create' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
>>>>>>> origin/main
    </Tab.Navigator>
  );
};

<<<<<<< HEAD
export default TabNavigator;
=======
export default TabNavigator;
=======
import { TabParamList } from '@/types/navigation';
import FeedScreen from '@/screens/home/FeedScreen';
import ServiceListScreen from '@/screens/booking/ServiceListScreen';
import MyBookingsScreen from '@/screens/booking/MyBookingsScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Services" component={ServiceListScreen} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
>>>>>>> origin/main
>>>>>>> origin/main
