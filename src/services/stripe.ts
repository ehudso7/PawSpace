import { initStripe, presentPaymentSheet as stripePresentPaymentSheet, PaymentSheetError, initPaymentSheet } from '@stripe/stripe-react-native';
import { MERCHANT_DISPLAY_NAME, STRIPE_PUBLISHABLE_KEY } from '../config';
import { apiPost } from './apiClient';
import type { PaymentResult, StripePaymentIntentData } from '../types';
export type PaymentIntent = StripePaymentIntentData;
export type BookingData = {
  service_id: string;
  provider_id?: string;
  appointment_time: string;
  pet_id?: string;
};

export async function initializeStripe(): Promise<void> {
  await initStripe({
    publishableKey: STRIPE_PUBLISHABLE_KEY,
    merchantDisplayName: MERCHANT_DISPLAY_NAME,
    // setUrlSchemeOnAndroid: true, // optional depending on setup
  });
}

export async function createPaymentIntent(amountCents: number, bookingData: BookingData): Promise<StripePaymentIntentData> {
  // Backend is expected to create payment intent and return clientSecret, customer, ephemeral key etc.
  const data = await apiPost<StripePaymentIntentData>('/payments/create-intent', {
    amount: amountCents,
    currency: 'usd',
    metadata: bookingData,
  });
  return data;
}

export async function presentPaymentSheet(intent: PaymentIntent): Promise<PaymentResult> {
  // The backend should have already created a Customer and ephemeral key as needed
  const { error: initError } = await initPaymentSheet({
    paymentIntentClientSecret: intent.clientSecret,
    merchantDisplayName: MERCHANT_DISPLAY_NAME,
    customerId: intent.customerId,
    customerEphemeralKeySecret: intent.customerEphemeralKeySecret,
  });
  if (initError) {
    return { status: 'failed', errorMessage: initError.message };
  }

  const { error } = await stripePresentPaymentSheet();
  if (error) {
    if (error.code === PaymentSheetError.Canceled) {
      return { status: 'canceled' };
    }
    return { status: 'failed', errorMessage: error.message };
  }

  return { status: 'succeeded' };
}
