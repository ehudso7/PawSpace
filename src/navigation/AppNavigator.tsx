import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { MyPetsScreen } from '@/screens/pets/MyPetsScreen';
import { BookingDetailScreen } from '@/screens/booking/BookingDetailScreen';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';
import { AddEditPetModal } from '@/screens/pets/AddEditPetModal';

export type RootStackParamList = {
  Tabs: undefined;
  BookingDetail: { id: string };
  EditProfile: undefined;
  AddEditPet: { id?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Pets" component={MyPetsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AddEditPet" component={AddEditPetModal} />
    </Stack.Navigator>
  );
}
