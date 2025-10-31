import { initStripe, presentPaymentSheet as stripePresent, useStripe } from '@stripe/stripe-react-native';
import { PaymentIntent, PaymentResult, BookingData } from '../types/booking';
import { ErrorHandler } from '../utils/errorHandler';

// Initialize Stripe with your publishable key
export const initializeStripe = async (publishableKey?: string) => {
  try {
    const key = publishableKey || process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
    
    if (!key) {
      throw new Error('Stripe publishable key not configured');
    }
    
    await initStripe({
      publishableKey: key,
      merchantIdentifier: 'merchant.com.pawspace', // Update with your Apple merchant ID
      urlScheme: 'pawspace', // Matches app.json scheme
    });
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    throw error;
  }
};

// Create payment intent on backend
export const createPaymentIntent = async (
  amount: number,
  bookingData: BookingData
): Promise<PaymentIntent> => {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.pawspace.com';
    const response = await fetch(`${apiUrl}/api/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          service_id: bookingData.service.id,
          provider_id: bookingData.provider.id,
          appointment_time: bookingData.appointment_time,
          pet_id: bookingData.pet_id || '',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to create payment intent`);
    }

    const data = await response.json();
    return data.paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw ErrorHandler.handle(error);
  }
};

// Present payment sheet
export const presentPaymentSheet = async (
  paymentIntent: PaymentIntent
): Promise<PaymentResult> => {
  try {
    const { error } = await stripePresent({
      paymentIntentClientSecret: paymentIntent.client_secret,
      merchantDisplayName: 'PawSpace',
      returnURL: 'pawspace://stripe-redirect',
    });

    if (error) {
      console.error('Stripe payment sheet error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      payment_intent_id: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error presenting payment sheet:', error);
    const errorMessage = ErrorHandler.handle(error);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Get saved payment methods
export const getSavedPaymentMethods = async () => {
  try {
    const response = await fetch('/api/payments/methods', {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment methods');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

// Save payment method
export const savePaymentMethod = async (paymentMethodId: string) => {
  try {
    const response = await fetch('/api/payments/save-method', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({ payment_method_id: paymentMethodId }),
    });

    if (!response.ok) {
      throw new Error('Failed to save payment method');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving payment method:', error);
    throw error;
  }
};

// Helper function to get auth token
const getAuthToken = async (): Promise<string> => {
  // Implement your auth token retrieval logic here
  // This could be from AsyncStorage, Redux store, or context
  return 'your-auth-token';
};

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  merchantId: 'merchant.com.pawspace',
  urlScheme: 'pawspace',
  merchantDisplayName: 'PawSpace',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.pawspace.com',
};