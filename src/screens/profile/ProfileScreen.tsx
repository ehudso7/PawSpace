import React from 'react';
import { View, Text } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { TabParamList } from '@/navigation/TabNavigator';

export type ProfileScreenProps = BottomTabScreenProps<TabParamList, 'Profile'>;

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
};
