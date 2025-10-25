import React from 'react';
import { View, Text } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { TabParamList } from '@/navigation/TabNavigator';

export type FeedScreenProps = BottomTabScreenProps<TabParamList, 'Feed'>;

export const FeedScreen: React.FC<FeedScreenProps> = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed Screen</Text>
    </View>
  );
};
