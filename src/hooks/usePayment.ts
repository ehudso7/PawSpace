import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { BookingPaymentData, PaymentResult } from '../types/stripe';
import { stripeService } from '../services/stripe';
import { 
  handleStripeError, 
  showErrorAlert, 
  showRetryAlert, 
  createErrorHandler,
  PaymentError 
} from '../utils/errorHandler';

interface UsePaymentReturn {
  processing: boolean;
  error: string | null;
  processBookingPayment: (bookingData: BookingPaymentData) => Promise<PaymentResult | null>;
  clearError: () => void;
}

export const usePayment = (): UsePaymentReturn => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processBookingPayment = useCallback(async (
    bookingData: BookingPaymentData
  ): Promise<PaymentResult | null> => {
    try {
      setProcessing(true);
      setError(null);

      const result = await stripeService.processBookingPayment(bookingData);
      
      Alert.alert(
        'Payment Successful',
        'Your booking has been confirmed and payment processed successfully.',
        [{ text: 'OK' }]
      );

      return result;
    } catch (err) {
      const errorHandler = createErrorHandler('Payment Processing');
      
      if (err instanceof PaymentError) {
        const stripeError = handleStripeError(err);
        setError(stripeError.message);
        showErrorAlert(stripeError, 'Payment Failed');
      } else {
        errorHandler(err as Error);
        setError(err instanceof Error ? err.message : 'Payment failed');
      }
      
      return null;
    } finally {
      setProcessing(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    processing,
    error,
    processBookingPayment,
    clearError,
  };
};