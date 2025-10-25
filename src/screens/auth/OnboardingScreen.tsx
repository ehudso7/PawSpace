import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, useTheme, Surface, Checkbox } from 'react-native-paper';
import type { AuthScreenProps } from '../../types/navigation';

type Props = AuthScreenProps<'Onboarding'>;

const OnboardingScreen: React.FC<Props> = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const theme = useTheme();

  const handleComplete = () => {
    // Onboarding complete - user will be automatically navigated to main app
    // by AppNavigator since they're authenticated
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
          Welcome! 🐾
        </Text>
        
        <Text variant="bodyLarge" style={styles.description}>
          Before we get started, let's set up your PawSpace experience.
        </Text>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Features
          </Text>
          <Text variant="bodyMedium" style={styles.feature}>
            📸 Share photos of your pets
          </Text>
          <Text variant="bodyMedium" style={styles.feature}>
            🗓️ Book pet services
          </Text>
          <Text variant="bodyMedium" style={styles.feature}>
            👥 Connect with other pet lovers
          </Text>
          <Text variant="bodyMedium" style={styles.feature}>
            🏥 Find trusted pet care providers
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={notifications ? 'checked' : 'unchecked'}
              onPress={() => setNotifications(!notifications)}
            />
            <Text variant="bodyMedium" style={styles.checkboxLabel}>
              Enable push notifications
            </Text>
          </View>

          <View style={styles.checkboxRow}>
            <Checkbox
              status={acceptedTerms ? 'checked' : 'unchecked'}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            />
            <Text variant="bodyMedium" style={styles.checkboxLabel}>
              I accept the Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleComplete}
          disabled={!acceptedTerms}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Get Started
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  feature: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
  },
  button: {
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default OnboardingScreen;
