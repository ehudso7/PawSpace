import React, { PropsWithChildren } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY } from './env';

export function StripeProviderWrapper({ children }: PropsWithChildren): JSX.Element {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      {children}
    </StripeProvider>
  );
}
export default StripeProviderWrapper;
