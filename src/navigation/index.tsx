import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';
import MyPetsScreen from '@/screens/pets/MyPetsScreen';
import AddEditPetModal from '@/screens/pets/AddEditPetModal';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import { Pressable, Text } from 'react-native';

export type RootStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  MyPets: undefined;
  AddEditPet: { petId?: string } | undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerTitle: 'Profile',
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Settings')}>
              <Text style={{ color: '#007AFF', fontWeight: '600' }}>Settings</Text>
            </Pressable>
          ),
        })}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="MyPets" component={MyPetsScreen} options={{ title: 'My Pets' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen
        name="AddEditPet"
        component={AddEditPetModal}
        options={{ presentation: 'modal', title: 'Pet' }}
      />
    </Stack.Navigator>
  );
}
