/**
 * App Entry Point with Stripe Provider
 * Initialize Stripe and wrap app with StripeProvider
 */

import React, { useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import stripeService from './src/services/stripe';

// Your app's main component
import AppNavigator from './src/navigation/AppNavigator'; // Adjust to your navigation setup

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key';

function App() {
  useEffect(() => {
    // Initialize Stripe service on app start
    stripeService.initialize(STRIPE_PUBLISHABLE_KEY, 'PawSpace');
  }, []);

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.pawspace" // Required for Apple Pay
    >
      <AppNavigator />
    </StripeProvider>
  );
}

export default App;
