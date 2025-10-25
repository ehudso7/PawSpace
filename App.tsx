import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StripeProvider} from '@stripe/stripe-react-native';
import RootNavigator from './src/navigation/RootNavigator';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_publishable_key_here'; // Replace with your actual key

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </StripeProvider>
    </SafeAreaProvider>
  );
}

export default App;