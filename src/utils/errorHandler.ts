import { Alert } from 'react-native';
import { StripeError } from '../types/stripe';

export class PaymentError extends Error {
  public code: string;
  public type: string;

  constructor(message: string, code: string, type: string) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.type = type;
  }
}

export class SubscriptionError extends Error {
  public code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'SubscriptionError';
    this.code = code;
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export const handleStripeError = (error: any): StripeError => {
  if (error.type === 'card_error') {
    return {
      code: error.code,
      message: getCardErrorMessage(error.code),
      type: 'card_error',
    };
  }

  if (error.type === 'validation_error') {
    return {
      code: error.code,
      message: 'Please check your information and try again.',
      type: 'validation_error',
    };
  }

  if (error.type === 'api_error') {
    return {
      code: error.code,
      message: 'A server error occurred. Please try again later.',
      type: 'api_error',
    };
  }

  return {
    code: error.code || 'unknown',
    message: error.message || 'An unexpected error occurred',
    type: error.type || 'unknown',
  };
};

export const getCardErrorMessage = (code: string): string => {
  switch (code) {
    case 'card_declined':
      return 'Your card was declined. Please try a different payment method.';
    case 'expired_card':
      return 'Your card has expired. Please use a different payment method.';
    case 'incorrect_cvc':
      return 'Your card\'s security code is incorrect. Please try again.';
    case 'incorrect_number':
      return 'Your card number is incorrect. Please try again.';
    case 'invalid_cvc':
      return 'Your card\'s security code is invalid. Please try again.';
    case 'invalid_expiry_month':
      return 'Your card\'s expiration month is invalid. Please try again.';
    case 'invalid_expiry_year':
      return 'Your card\'s expiration year is invalid. Please try again.';
    case 'invalid_number':
      return 'Your card number is invalid. Please try again.';
    case 'missing':
      return 'There is no card on a customer that is being charged.';
    case 'processing_error':
      return 'An error occurred while processing your card. Please try again.';
    case 'insufficient_funds':
      return 'Your card has insufficient funds. Please try a different payment method.';
    default:
      return 'Your card was declined. Please try a different payment method.';
  }
};

export const showErrorAlert = (error: Error | StripeError, title: string = 'Error') => {
  const message = error.message || 'An unexpected error occurred';
  
  Alert.alert(
    title,
    message,
    [
      {
        text: 'OK',
        style: 'default',
      },
    ]
  );
};

export const showRetryAlert = (
  error: Error | StripeError,
  onRetry: () => void,
  title: string = 'Error'
) => {
  const message = error.message || 'An unexpected error occurred';
  
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Retry',
        onPress: onRetry,
        style: 'default',
      },
    ]
  );
};

export const isNetworkError = (error: any): boolean => {
  return (
    error instanceof NetworkError ||
    error.message?.includes('Network request failed') ||
    error.message?.includes('fetch') ||
    error.code === 'NETWORK_ERROR'
  );
};

export const isPaymentError = (error: any): boolean => {
  return (
    error instanceof PaymentError ||
    error.type === 'card_error' ||
    error.type === 'validation_error'
  );
};

export const isSubscriptionError = (error: any): boolean => {
  return error instanceof SubscriptionError;
};

export const logError = (error: Error, context?: string) => {
  console.error(`[${context || 'Error'}]`, {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
};

export const createErrorHandler = (context: string) => {
  return (error: Error) => {
    logError(error, context);
    
    if (isNetworkError(error)) {
      showErrorAlert(error, 'Connection Error');
    } else if (isPaymentError(error)) {
      showErrorAlert(error, 'Payment Error');
    } else if (isSubscriptionError(error)) {
      showErrorAlert(error, 'Subscription Error');
    } else {
      showErrorAlert(error, 'Unexpected Error');
    }
  };
};