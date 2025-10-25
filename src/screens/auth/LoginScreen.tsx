import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import type { AuthStackScreenProps } from '../../types/navigation';

export default function LoginScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Welcome to PawSpace</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <Button
        mode="contained"
        onPress={() => navigation.replace('Onboarding')}
        style={styles.primaryButton}
      >
        Continue
      </Button>

      <Button onPress={() => navigation.navigate('Signup')}>
        Create an account
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
