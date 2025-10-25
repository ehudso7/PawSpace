import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ServiceListScreen from '@/screens/booking/ServiceListScreen';
import ProviderProfileScreen from '@/screens/ProviderProfileScreen';

export type RootStackParamList = {
  ServiceList: undefined;
  ProviderProfile: { serviceId: string } | { service: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ServiceList" component={ServiceListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
