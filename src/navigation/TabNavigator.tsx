import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { FeedScreen, TransformationDetailScreen } from '@/screens/home';
import { ServiceListScreen, ProviderProfileScreen, BookingCalendarScreen, BookingConfirmScreen, MyBookingsScreen } from '@/screens/booking';
import { ImageSelectorScreen, EditorScreen, PreviewScreen } from '@/screens/create';
import { ProfileScreen, EditProfileScreen, SettingsScreen, SubscriptionScreen } from '@/screens/profile';
import { TabParamList, HomeStackParamList, BookingStackParamList, CreateStackParamList, ProfileStackParamList } from '@/types/navigation';
import { theme } from '@/constants/theme';

const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const BookingStack = createNativeStackNavigator<BookingStackParamList>();
const CreateStack = createNativeStackNavigator<CreateStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

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

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
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
    </Tab.Navigator>
  );
};

export default TabNavigator;