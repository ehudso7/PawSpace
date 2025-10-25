import React from 'react';
import { View, Text } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { TabParamList } from '@/navigation/TabNavigator';

export type ServiceListScreenProps = BottomTabScreenProps<TabParamList, 'Services'>;

export const ServiceListScreen: React.FC<ServiceListScreenProps> = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Service List Screen</Text>
    </View>
  );
};
