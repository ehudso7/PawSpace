import { useStripe, useStripePaymentSheet } from '@stripe/stripe-react-native';
import { 
  SubscriptionResult, 
  SubscriptionStatus, 
  BookingPaymentData, 
  PaymentResult, 
  StripeError,
  PaymentSheetConfig 
} from '../types/stripe';

class StripeService {
  private publishableKey: string;
  private baseUrl: string;

  constructor() {
    this.publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
    this.baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  }

  // Initialize Stripe on app start
  async initialize(publishableKey?: string): Promise<void> {
    if (publishableKey) {
      this.publishableKey = publishableKey;
    }
    
    if (!this.publishableKey) {
      throw new Error('Stripe publishable key is required');
    }
  }

  // Create subscription
  async createSubscription(userId: string): Promise<SubscriptionResult> {
    try {
      // 1. Call backend to create subscription
      const response = await fetch(`${this.baseUrl}/functions/v1/create-subscription`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          price_id: 'price_premium_monthly', // Stripe price ID
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create subscription');
      }

      const { clientSecret, subscriptionId } = await response.json();

      // 2. Present payment sheet
      const { error } = await this.presentPaymentSheet({
        clientSecret,
        merchantDisplayName: 'PawSpace',
      });

      if (error) {
        throw new Error(error.message);
      }

      return { subscriptionId };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/functions/v1/cancel-subscription`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ subscription_id: subscriptionId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Process booking payment (marketplace transaction)
  async processBookingPayment(bookingData: BookingPaymentData): Promise<PaymentResult> {
    try {
      // 1. Create payment intent with application fee (10% commission)
      const response = await fetch(`${this.baseUrl}/functions/v1/create-booking-payment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
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
        throw new Error(error.message || 'Failed to create booking payment');
      }

      const { clientSecret } = await response.json();

      // 2. Present payment sheet
      const { error, paymentIntent } = await this.presentPaymentSheet({
        clientSecret,
        merchantDisplayName: bookingData.providerName,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { paymentIntent, success: true };
    } catch (error) {
      console.error('Error processing booking payment:', error);
      throw error;
    }
  }

  // Check subscription status
  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/functions/v1/subscription-status/${userId}`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get subscription status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  }

  // Onboard provider for Stripe Connect
  async onboardProvider(userId: string, email: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/functions/v1/provider-onboarding`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          user_id: userId,
          email: email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create provider onboarding');
      }

      const { onboarding_url } = await response.json();
      return onboarding_url;
    } catch (error) {
      console.error('Error onboarding provider:', error);
      throw error;
    }
  }

  // Present payment sheet
  private async presentPaymentSheet(config: PaymentSheetConfig): Promise<any> {
    // This would be implemented using the actual Stripe React Native SDK
    // For now, returning a mock implementation
    return new Promise((resolve) => {
      // In a real implementation, you would use:
      // const { initPaymentSheet, presentPaymentSheet } = useStripePaymentSheet();
      // await initPaymentSheet({ ...config });
      // const result = await presentPaymentSheet();
      // resolve(result);
      
      // Mock implementation for now
      setTimeout(() => {
        resolve({ error: null, paymentIntent: { id: 'pi_mock' } });
      }, 1000);
    });
  }

  // Get authentication token
  private async getAuthToken(): Promise<string> {
    // This would get the actual auth token from your auth system
    // For now, returning a mock token
    return 'mock_auth_token';
  }

  // Handle Stripe errors
  handleStripeError(error: any): StripeError {
    return {
      code: error.code || 'unknown',
      message: error.message || 'An unknown error occurred',
      type: error.type || 'api_error',
    };
  }
}

// Export singleton instance
export const stripeService = new StripeService();
export default stripeService;