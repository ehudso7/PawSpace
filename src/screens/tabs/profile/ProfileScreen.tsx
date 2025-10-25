import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../../types/navigation';

export type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium">Profile</Text>
      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
        Edit Profile
      </Button>
      <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('Settings')}>
        Settings
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default ProfileScreen;
