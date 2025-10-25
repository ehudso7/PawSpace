import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { ProfileStackScreenProps } from '../../types/navigation';

export default function SettingsScreen({ navigation }: ProfileStackScreenProps<'Settings'>) {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>App preferences</Text>

      <Button onPress={() => navigation.goBack()}>Back</Button>
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
});
