import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types/navigation';

export type OnboardingScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Onboarding'
>;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium">Onboarding</Text>
      <Text style={styles.meta}>Tell us about your pet!</Text>
      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('Login')}>
        Finish
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
  meta: { marginTop: 8 },
});

export default OnboardingScreen;
