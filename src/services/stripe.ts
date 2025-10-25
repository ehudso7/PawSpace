import { useStripe, initStripe, presentPaymentSheet } from '@stripe/stripe-react-native';
import { 
  SubscriptionResult, 
  SubscriptionStatus, 
  BookingPaymentData, 
  PaymentResult, 
  ProviderOnboardingResult,
  CreateSubscriptionRequest,
  CreateBookingPaymentRequest
} from '../types/payment';

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://your-project.supabase.co/functions/v1';

class StripeService {
  private initialized = false;

  /**
   * Initialize Stripe with publishable key
   */
  async initialize(publishableKey?: string): Promise<void> {
    try {
      const key = publishableKey || STRIPE_PUBLISHABLE_KEY;
      if (!key) {
        throw new Error('Stripe publishable key is required');
      }

      await initStripe({
        publishableKey: key,
        merchantIdentifier: 'merchant.com.pawspace',
        urlScheme: 'pawspace',
      });

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      throw error;
    }
  }

  /**
   * Create a new subscription with 7-day free trial
   */
  async createSubscription(userId: string, priceId: string = 'price_premium_monthly'): Promise<SubscriptionResult> {
    if (!this.initialized) {
      throw new Error('Stripe not initialized. Call initialize() first.');
    }

    try {
      // 1. Call backend to create subscription
      const response = await fetch(`${API_BASE_URL}/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          user_id: userId,
        } as CreateSubscriptionRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subscription');
      }

      const { clientSecret, subscriptionId } = await response.json();

      // 2. Present payment sheet
      const { error } = await presentPaymentSheet({
        clientSecret,
        merchantDisplayName: 'PawSpace',
        style: 'alwaysDark',
        googlePay: {
          merchantCountryCode: 'US',
          testEnv: __DEV__,
        },
        applePay: {
          merchantCountryCode: 'US',
        },
      });

      if (error) {
        console.error('Payment sheet error:', error);
        throw new Error(error.message);
      }

      return { subscriptionId };
    } catch (error) {
      console.error('Create subscription error:', error);
      throw error;
    }
  }

  /**
   * Cancel an active subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ subscription_id: subscriptionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }

  /**
   * Process booking payment with marketplace commission
   */
  async processBookingPayment(bookingData: BookingPaymentData): Promise<PaymentResult> {
    if (!this.initialized) {
      throw new Error('Stripe not initialized. Call initialize() first.');
    }

    try {
      // 1. Create payment intent with application fee (10% commission)
      const response = await fetch(`${API_BASE_URL}/create-booking-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          amount: Math.round(bookingData.amount * 100), // Convert to cents
          provider_stripe_account_id: bookingData.providerId,
          application_fee_amount: Math.round(bookingData.amount * 0.10 * 100), // 10% commission
          booking_id: bookingData.bookingId,
          description: bookingData.description || `Booking payment for ${bookingData.providerName}`,
        } as CreateBookingPaymentRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking payment');
      }

      const { clientSecret } = await response.json();

      // 2. Present payment sheet
      const { error, paymentIntent } = await presentPaymentSheet({
        clientSecret,
        merchantDisplayName: bookingData.providerName,
        style: 'alwaysDark',
        googlePay: {
          merchantCountryCode: 'US',
          testEnv: __DEV__,
        },
        applePay: {
          merchantCountryCode: 'US',
        },
      });

      if (error) {
        console.error('Booking payment error:', error);
        throw new Error(error.message);
      }

      return { 
        paymentIntent,
        success: true 
      };
    } catch (error) {
      console.error('Process booking payment error:', error);
      throw error;
    }
  }

  /**
   * Get current subscription status for a user
   */
  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/subscription-status/${userId}`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get subscription status');
      }

      return await response.json();
    } catch (error) {
      console.error('Get subscription status error:', error);
      // Return default free status on error
      return {
        is_premium: false,
        plan: 'free',
        is_trial: false,
        can_cancel: false,
      };
    }
  }

  /**
   * Onboard provider for Stripe Connect
   */
  async onboardProvider(userId: string, email: string): Promise<ProviderOnboardingResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/onboard-provider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          user_id: userId,
          email: email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to onboard provider');
      }

      return await response.json();
    } catch (error) {
      console.error('Provider onboarding error:', error);
      throw error;
    }
  }

  /**
   * Get auth token for API requests
   */
  private async getAuthToken(): Promise<string> {
    // This should be implemented based on your auth system
    // For now, return empty string - you'll need to integrate with your auth
    return '';
  }

  /**
   * Check if Stripe is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

// Export singleton instance
export const stripeService = new StripeService();
export default stripeService;