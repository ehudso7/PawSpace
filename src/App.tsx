import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import stripeService from './services/stripe';
import SubscriptionScreen from './screens/profile/SubscriptionScreen';

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export default function App() {
  useEffect(() => {
    // Initialize Stripe when app starts
    const initializeStripe = async () => {
      try {
        await stripeService.initialize(STRIPE_PUBLISHABLE_KEY);
        console.log('Stripe initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
      }
    };

    initializeStripe();
  }, []);

  // Mock user ID - replace with actual user authentication
  const userId = 'user_123';

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <View style={styles.container}>
        <SubscriptionScreen userId={userId} />
      </View>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});