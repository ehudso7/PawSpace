import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { AuthStackScreenProps } from '../../types/navigation';
import { supabase } from '../../lib/supabase';

export default function OnboardingScreen({ navigation }: AuthStackScreenProps<'Onboarding'>) {
  const handleFinish = async () => {
    // Placeholder: in a real app you might collect info and then sign in/up.
    // Here we simply set a fake session by signing in anonymously if configured,
    // or you can replace with your actual auth flow.
    try {
      // This example assumes you have some auth mechanism; for now navigate to main by popping stack.
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      // No-op: keep UX simple for scaffolding
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>You're all set</Text>
      <Text style={styles.subtitle}>Let’s get you into the app</Text>

      <Button mode="contained" onPress={handleFinish} style={styles.primaryButton}>
        Finish onboarding
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
