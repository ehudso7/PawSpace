import { StripeProvider, useStripe, initStripe, presentPaymentSheet } from '@stripe/stripe-react-native';

export type SubscriptionResult = { subscriptionId: string };
export type SubscriptionStatus = {
  is_premium: boolean;
  plan: 'free' | 'premium';
  expires_at?: string;
  is_trial: boolean;
  trial_ends_at?: string;
  can_cancel: boolean;
};

export type BookingPaymentData = {
  amount: number;
  providerId: string;
  providerName: string;
  bookingId: string;
};

export type PaymentResult = { paymentIntent: string };

class StripeService {
  private initialized = false;

  async initialize(publishableKey: string) {
    if (this.initialized) return;
    await initStripe({
      publishableKey,
      merchantIdentifier: 'merchant.com.pawspace',
      urlScheme: 'pawspace',
      setUrlSchemeOnAndroid: true,
    });
    this.initialized = true;
  }

  async createSubscription(priceId: string, userId: string): Promise<SubscriptionResult> {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price_id: priceId, user_id: userId }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create subscription: ${text}`);
    }

    const { clientSecret, subscriptionId } = await response.json();

    const { error } = await presentPaymentSheet({
      clientSecret,
      merchantDisplayName: 'PawSpace',
    });

    if (error) throw new Error(error.message);

    return { subscriptionId };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription_id: subscriptionId }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to cancel subscription: ${text}`);
    }
  }

  async processBookingPayment(bookingData: BookingPaymentData): Promise<PaymentResult> {
    const response = await fetch('/api/create-booking-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(bookingData.amount * 100),
        provider_stripe_account_id: bookingData.providerId,
        application_fee_amount: Math.round(bookingData.amount * 0.1 * 100),
        booking_id: bookingData.bookingId,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create booking payment: ${text}`);
    }

    const { clientSecret } = await response.json();

    const { error, paymentIntent } = await presentPaymentSheet({
      clientSecret,
      merchantDisplayName: bookingData.providerName,
    });

    if (error) throw new Error(error.message);

    return { paymentIntent };
  }

  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    const response = await fetch(`/api/subscription-status/${userId}`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to get subscription status: ${text}`);
    }
    return response.json();
  }
}

export const stripeService = new StripeService();
