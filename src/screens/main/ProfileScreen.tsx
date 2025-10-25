import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { ProfileStackScreenProps } from '../../types/navigation';

export default function ProfileScreen({ navigation }: ProfileStackScreenProps<'Profile'>) {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Manage your account</Text>

      <Button mode="contained" onPress={() => navigation.navigate('Settings')} style={styles.primaryButton}>
        Settings
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
    opacity: 0.7,
  },
  primaryButton: {
    width: '100%',
    marginBottom: 8,
  },
});
