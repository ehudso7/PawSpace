import {
  initStripe,
  createPaymentMethod,
  presentPaymentSheet,
  initPaymentSheet,
  PaymentSheetError,
} from '@stripe/stripe-react-native';
import {BookingData, PaymentIntent, PaymentResult, PaymentMethod} from '../types/booking';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_publishable_key_here'; // Replace with your actual key
const API_BASE_URL = 'https://your-api-url.com'; // Replace with your actual API URL

class StripeService {
  private initialized = false;

  async initializeStripe(): Promise<void> {
    if (this.initialized) return;

    try {
      await initStripe({
        publishableKey: STRIPE_PUBLISHABLE_KEY,
        merchantIdentifier: 'merchant.com.pawspace', // Replace with your merchant ID
      });
      this.initialized = true;
      console.log('Stripe initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      throw new Error('Failed to initialize payment system');
    }
  }

  async createPaymentIntent(
    amount: number,
    bookingData: BookingData,
  ): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          booking_data: bookingData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      return {
        id: data.id,
        client_secret: data.client_secret,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  async presentPaymentSheet(paymentIntent: PaymentIntent): Promise<PaymentResult> {
    try {
      await this.initializeStripe();

      // Initialize the payment sheet
      const {error: initError} = await initPaymentSheet({
        merchantDisplayName: 'PawSpace',
        paymentIntentClientSecret: paymentIntent.client_secret,
        defaultBillingDetails: {
          name: 'Customer', // You can get this from user profile
        },
        allowsDelayedPaymentMethods: true,
        returnURL: 'pawspace://payment-return',
      });

      if (initError) {
        console.error('Error initializing payment sheet:', initError);
        return {
          error: {
            code: initError.code,
            message: initError.message,
          },
        };
      }

      // Present the payment sheet
      const {error: presentError} = await presentPaymentSheet();

      if (presentError) {
        console.error('Error presenting payment sheet:', presentError);
        return {
          error: {
            code: presentError.code,
            message: presentError.message,
          },
        };
      }

      // Payment successful
      return {
        paymentIntent: {
          id: paymentIntent.id,
          status: 'succeeded',
        },
      };
    } catch (error) {
      console.error('Error in payment flow:', error);
      return {
        error: {
          code: 'unknown_error',
          message: 'An unexpected error occurred during payment',
        },
      };
    }
  }

  async getSavedPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header here
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();
      return data.payment_methods || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  async addPaymentMethod(): Promise<PaymentMethod | null> {
    try {
      await this.initializeStripe();

      const {paymentMethod, error} = await createPaymentMethod({
        paymentMethodType: 'Card',
      });

      if (error) {
        console.error('Error creating payment method:', error);
        throw new Error(error.message);
      }

      if (!paymentMethod) {
        throw new Error('No payment method created');
      }

      // Save payment method to backend
      const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header here
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save payment method');
      }

      const savedMethod = await response.json();
      return savedMethod;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  formatPaymentMethodDisplay(paymentMethod: PaymentMethod): string {
    const {card} = paymentMethod;
    return `**** **** **** ${card.last4} (${card.brand.toUpperCase()})`;
  }

  formatExpiryDate(month: number, year: number): string {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  }
}

export default new StripeService();