import { initStripe, presentPaymentSheet, createPaymentMethod, createToken } from '@stripe/stripe-react-native';
import { Config, getFunctionUrl } from '../lib/config';
import type { BookingPaymentData, PaymentResult, SubscriptionResult, SubscriptionStatus } from '../types/billing';

class StripeService {
  private initialized = false;

  async initialize(publishableKey?: string) {
    if (this.initialized) return;
    const key = publishableKey || Config.STRIPE_PUBLISHABLE_KEY;
    if (!key) throw new Error('Missing Stripe publishable key');
    const { error } = await initStripe({ publishableKey: key, merchantIdentifier: 'com.pawspace.app' });
    if (error) throw error;
    this.initialized = true;
  }

  async createSubscription(params: { priceId: string; userId: string }): Promise<SubscriptionResult> {
    const res = await fetch(getFunctionUrl('create-subscription'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price_id: params.priceId, user_id: params.userId }),
    });
    if (!res.ok) throw new Error(`Subscription create failed: ${res.status}`);
    const { clientSecret, subscriptionId } = await res.json();

    const { error } = await presentPaymentSheet({ clientSecret, merchantDisplayName: 'PawSpace' });
    if (error) throw error;

    return { subscriptionId };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const res = await fetch(getFunctionUrl('cancel-subscription'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription_id: subscriptionId }),
    });
    if (!res.ok) throw new Error(`Cancel failed: ${res.status}`);
  }

  async processBookingPayment(bookingData: BookingPaymentData): Promise<PaymentResult> {
    const res = await fetch(getFunctionUrl('create-booking-payment'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(bookingData.amount * 100),
        provider_stripe_account_id: bookingData.providerId,
        application_fee_amount: Math.round(bookingData.amount * 0.1 * 100),
        booking_id: bookingData.bookingId,
      }),
    });
    if (!res.ok) throw new Error(`Payment intent create failed: ${res.status}`);
    const { clientSecret } = await res.json();

    const { error, paymentIntent } = await presentPaymentSheet({ clientSecret, merchantDisplayName: bookingData.providerName });
    if (error) throw error;

    return { paymentIntentId: paymentIntent?.id ?? 'unknown', status: (paymentIntent?.status as PaymentResult['status']) || 'unknown' };
  }

  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    const res = await fetch(getFunctionUrl(`subscription-status/${encodeURIComponent(userId)}`));
    if (!res.ok) throw new Error(`Status fetch failed: ${res.status}`);
    return res.json();
  }

  async openBillingPortal(userId: string): Promise<{ url: string }> {
    const res = await fetch(getFunctionUrl('portal'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, return_url: Config.BILLING_PORTAL_RETURN_URL }),
    });
    if (!res.ok) throw new Error(`Portal session failed: ${res.status}`);
    return res.json();
  }
}

export const stripeService = new StripeService();
