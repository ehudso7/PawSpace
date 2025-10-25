import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { AuthStackScreenProps } from '../../types/navigation';

export default function SignupScreen({ navigation }: AuthStackScreenProps<'Signup'>) {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Create your account</Text>

      <Button
        mode="contained"
        onPress={() => navigation.replace('Onboarding')}
        style={styles.primaryButton}
      >
        Sign up
      </Button>

      <Button onPress={() => navigation.goBack()}>I already have an account</Button>
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
    marginBottom: 24,
  },
  primaryButton: {
    width: '100%',
    marginBottom: 8,
  },
});
