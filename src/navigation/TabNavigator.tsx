import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const BookingStack = createNativeStackNavigator<BookingStackParamList>();
const CreateStack = createNativeStackNavigator<CreateStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

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

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="BookingTab" component={BookingStackNavigator} options={{ title: 'Book' }} />
      <Tab.Screen name="CreateTab" component={CreateStackNavigator} options={{ title: 'Create' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
