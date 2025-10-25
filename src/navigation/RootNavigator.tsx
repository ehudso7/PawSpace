import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './navigationRef';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';
import MyPetsScreen from '@/screens/pets/MyPetsScreen';
import AddEditPetModal from '@/screens/pets/AddEditPetModal';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import BookingDetailScreen from '@/screens/booking/BookingDetailScreen';

export type RootStackParamList = {
  Profile: { userId?: string } | undefined;
  EditProfile: undefined;
  MyPets: undefined;
  AddEditPet: { petId?: string } | undefined;
  Settings: undefined;
  BookingDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="MyPets" component={MyPetsScreen} options={{ title: 'My Pets' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} options={{ title: 'Booking' }} />
      <Stack.Screen name="AddEditPet" component={AddEditPetModal} options={{ title: 'Pet', presentation: 'modal' }} />
    </Stack.Navigator>
  );
};
