import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FeedScreen } from '@/screens/home/FeedScreen';
import { ServiceListScreen } from '@/screens/booking/ServiceListScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';

export type TabParamList = {
  Feed: undefined;
  Services: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Services" component={ServiceListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
