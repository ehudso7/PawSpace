/**
 * Stripe Payment Service
 * Handles subscriptions and marketplace transactions
 */

import { useStripe, initPaymentSheet, presentPaymentSheet, StripeProvider } from '@stripe/stripe-react-native';
import { 
  SubscriptionResult, 
  SubscriptionStatus, 
  BookingPaymentData, 
  PaymentResult,
  ProviderOnboardingResult,
  PaymentError 
} from '../types/payment';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:54321/functions/v1';

class StripeService {
  private publishableKey: string = '';
  private merchantDisplayName: string = 'PawSpace';

  /**
   * Initialize Stripe with publishable key
   */
  async initialize(publishableKey: string, merchantDisplayName: string = 'PawSpace'): Promise<void> {
    this.publishableKey = publishableKey;
    this.merchantDisplayName = merchantDisplayName;
  }

  /**
   * Create a new subscription with 7-day free trial
   */
  async createSubscription(userId: string, priceId: string = 'price_premium_monthly'): Promise<SubscriptionResult> {
    try {
      // 1. Call backend to create subscription
      const response = await fetch(`${API_BASE_URL}/create-subscription`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: priceId,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create subscription');
      }

      const { clientSecret, subscriptionId } = await response.json();

      // 2. Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: this.merchantDisplayName,
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: {
          name: '',
        },
        returnURL: 'pawspace://payment-return',
        allowsDelayedPaymentMethods: true,
      });

      if (initError) {
        throw new Error(initError.message);
      }

      // 3. Present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        throw new Error(presentError.message);
      }

      return { subscriptionId };
    } catch (error) {
      const paymentError: PaymentError = {
        code: 'subscription_creation_failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'api_error',
      };
      throw paymentError;
    }
  }

  /**
   * Cancel an active subscription
   */
  async cancelSubscription(subscriptionId: string, userId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/cancel-subscription`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          subscription_id: subscriptionId,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      const paymentError: PaymentError = {
        code: 'subscription_cancellation_failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'api_error',
      };
      throw paymentError;
    }
  }

  /**
   * Process booking payment with marketplace commission (10%)
   */
  async processBookingPayment(bookingData: BookingPaymentData): Promise<PaymentResult> {
    try {
      // 1. Create payment intent with application fee (10% commission)
      const response = await fetch(`${API_BASE_URL}/create-booking-payment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(bookingData.amount * 100), // Convert to cents
          provider_stripe_account_id: bookingData.providerId,
          application_fee_amount: Math.round(bookingData.amount * 0.10 * 100), // 10%
          booking_id: bookingData.bookingId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment');
      }

      const { clientSecret } = await response.json();

      // 2. Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: bookingData.providerName,
        paymentIntentClientSecret: clientSecret,
        returnURL: 'pawspace://booking-payment-return',
      });

      if (initError) {
        throw new Error(initError.message);
      }

      // 3. Present payment sheet
      const { error: presentError, paymentOption } = await presentPaymentSheet();

      if (presentError) {
        throw new Error(presentError.message);
      }

      return { 
        paymentIntent: {
          id: clientSecret.split('_secret_')[0],
          status: 'succeeded',
        } 
      };
    } catch (error) {
      const paymentError: PaymentError = {
        code: 'booking_payment_failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'card_error',
      };
      throw paymentError;
    }
  }

  /**
   * Get user's subscription status
   */
  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/subscription-status/${userId}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get subscription status');
      }

      const status: SubscriptionStatus = await response.json();
      return status;
    } catch (error) {
      // Return free tier if error
      return {
        is_premium: false,
        plan: 'free',
        is_trial: false,
        can_cancel: false,
        transformations_used: 0,
        transformations_limit: 3,
      };
    }
  }

  /**
   * Onboard provider for Stripe Connect (receive payments)
   */
  async onboardProvider(userId: string, email: string): Promise<ProviderOnboardingResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/onboard-provider`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          email: email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to onboard provider');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      const paymentError: PaymentError = {
        code: 'provider_onboarding_failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'api_error',
      };
      throw paymentError;
    }
  }

  /**
   * Get Stripe publishable key
   */
  getPublishableKey(): string {
    return this.publishableKey;
  }
}

// Export singleton instance
export const stripeService = new StripeService();
export default stripeService;
