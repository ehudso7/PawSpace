import { initStripe, presentPaymentSheet as stripePresent, useStripe } from '@stripe/stripe-react-native';
import { PaymentIntent, PaymentResult, BookingData } from '../types/booking';
import { ErrorHandler } from '../utils/errorHandler';
import { APP_CONFIG } from '../config/appConfig';

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: APP_CONFIG.stripe.publishableKey,
  merchantId: APP_CONFIG.stripe.merchantId,
  urlScheme: APP_CONFIG.stripe.urlScheme,
};

if (!STRIPE_CONFIG.publishableKey && APP_CONFIG.env === 'production') {
  console.warn('Warning: Stripe publishable key is not configured. Payments will not work.');
}

// Initialize Stripe with your publishable key
export const initializeStripe = async (publishableKey?: string) => {
  const key = publishableKey || STRIPE_CONFIG.publishableKey;
  if (!key) {
    throw new Error('Stripe publishable key is not configured');
  }
  
  try {
    await initStripe({
      publishableKey: key,
      merchantIdentifier: STRIPE_CONFIG.merchantId,
      urlScheme: STRIPE_CONFIG.urlScheme,
    });
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    throw error;
  }
};

// Helper function to get auth token
const getAuthToken = async (): Promise<string> => {
  // TODO: Implement your auth token retrieval logic here
  // This could be from AsyncStorage, Redux store, or context
  // Example: return await AsyncStorage.getItem('auth_token') || '';
  return '';
};

// Create payment intent on backend
export const createPaymentIntent = async (
  amount: number,
  bookingData: BookingData
): Promise<PaymentIntent> => {
  if (!APP_CONFIG.api.baseUrl) {
    throw new Error('API base URL is not configured');
  }
  
  try {
    const response = await fetch(`${APP_CONFIG.api.baseUrl}/api/payments/create-intent`, {
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
      returnURL: `${APP_CONFIG.scheme}://stripe-redirect`,
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
  if (!APP_CONFIG.api.baseUrl) {
    throw new Error('API base URL is not configured');
  }
  
  try {
    const response = await fetch(`${APP_CONFIG.api.baseUrl}/api/payments/methods`, {
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
  if (!APP_CONFIG.api.baseUrl) {
    throw new Error('API base URL is not configured');
  }
  
  try {
    const response = await fetch(`${APP_CONFIG.api.baseUrl}/api/payments/save-method`, {
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
