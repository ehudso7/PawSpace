import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import ErrorBoundary from './components/ErrorBoundary';
import SubscriptionScreen from './screens/profile/SubscriptionScreen';

// Mock user ID for demonstration
const MOCK_USER_ID = 'user-123';

export default function App() {
  const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

  return (
    <ErrorBoundary>
      <StripeProvider publishableKey={publishableKey}>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <SubscriptionScreen userId={MOCK_USER_ID} />
        </View>
      </StripeProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});