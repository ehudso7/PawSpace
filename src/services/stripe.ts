import { initPaymentSheet, presentPaymentSheet as stripePresentPaymentSheet, PaymentSheetError, PaymentSheetResult } from '@stripe/stripe-react-native';
import { http } from '../utils/http';
import { merchantDisplayName } from '../config/stripe';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number; // in major currency units
  currency: string; // e.g., 'USD'
  customerId?: string;
  customerEphemeralKeySecret?: string;
}

export interface BookingData {
  service_id: string;
  appointment_time: string; // ISO string
  pet_id?: string;
  notes?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  errorMessage?: string;
}

export async function initializeStripe(): Promise<void> {
  // If the app uses StripeProvider at the app root, this can be a no-op.
  // We rely on initPaymentSheet per flow.
  return;
}

export async function createPaymentIntent(amount: number, bookingData: BookingData): Promise<PaymentIntent> {
  const payload = {
    amount, // major currency units; backend should convert
    currency: bookingData?.['currency'] || undefined,
    metadata: {
      service_id: bookingData.service_id,
      appointment_time: bookingData.appointment_time,
      pet_id: bookingData.pet_id,
    },
  } as any;

  const response = await http<{
    id: string;
    client_secret: string;
    amount: number;
    currency: string;
    customer_id?: string;
    ephemeral_key?: string;
  }>('/payments/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    id: response.id,
    clientSecret: response.client_secret,
    amount: response.amount,
    currency: response.currency,
    customerId: response.customer_id,
    customerEphemeralKeySecret: response.ephemeral_key,
  };
}

export async function presentPaymentSheet(intent: PaymentIntent): Promise<PaymentResult> {
  const init = await initPaymentSheet({
    paymentIntentClientSecret: intent.clientSecret,
    merchantDisplayName,
    customerId: intent.customerId,
    customerEphemeralKeySecret: intent.customerEphemeralKeySecret,
    allowsDelayedPaymentMethods: false,
    style: 'automatic',
  });

  if (init.error) {
    return { success: false, errorMessage: init.error.message };
  }

  const result: PaymentSheetResult = await stripePresentPaymentSheet();
  if (result.error) {
    const err = result.error as PaymentSheetError;
    if (err.code === 'Canceled') {
      return { success: false, errorMessage: 'Payment canceled' };
    }
    return { success: false, errorMessage: err.message };
  }

  return { success: true, paymentIntentId: intent.id };
}
