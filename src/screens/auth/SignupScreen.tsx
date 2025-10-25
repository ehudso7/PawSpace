import React from 'react';
import { View, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/AuthNavigator';

export type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export const SignupScreen: React.FC<SignupScreenProps> = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Signup Screen</Text>
    </View>
  );
};
