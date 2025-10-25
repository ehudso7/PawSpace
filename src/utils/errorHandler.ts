import { Alert } from 'react-native';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export class ErrorHandler {
  static handle(error: any): string {
    console.error('Error occurred:', error);

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 400:
          return message || 'Invalid request. Please check your input.';
        case 401:
          return 'You are not authorized. Please log in again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return message || 'This action conflicts with existing data.';
        case 422:
          return message || 'Validation error. Please check your input.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 502:
        case 503:
        case 504:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return message || 'An unexpected error occurred. Please try again.';
      }
    } else if (error.request) {
      // Network error
      return 'Network error. Please check your internet connection and try again.';
    } else if (error.code === 'NETWORK_ERROR') {
      return 'Network error. Please check your internet connection.';
    } else if (error.code === 'TIMEOUT') {
      return 'Request timed out. Please try again.';
    } else if (error.message) {
      // Generic error with message
      return error.message;
    } else {
      // Unknown error
      return 'An unexpected error occurred. Please try again.';
    }
  }

  static showError(error: any, title: string = 'Error') {
    const message = this.handle(error);
    Alert.alert(title, message);
  }

  static showNetworkError() {
    Alert.alert(
      'Connection Error',
      'Please check your internet connection and try again.',
      [{ text: 'OK' }]
    );
  }

  static showServerError() {
    Alert.alert(
      'Server Error',
      'Something went wrong on our end. Please try again later.',
      [{ text: 'OK' }]
    );
  }

  static showValidationError(errors: string[]) {
    Alert.alert(
      'Validation Error',
      errors.join('\n'),
      [{ text: 'OK' }]
    );
  }

  static showPaymentError(error: any) {
    let message = 'Payment failed. Please try again.';
    
    if (error.code) {
      switch (error.code) {
        case 'card_declined':
          message = 'Your card was declined. Please try a different payment method.';
          break;
        case 'expired_card':
          message = 'Your card has expired. Please use a different payment method.';
          break;
        case 'incorrect_cvc':
          message = 'Your card\'s security code is incorrect. Please try again.';
          break;
        case 'processing_error':
          message = 'An error occurred while processing your card. Please try again.';
          break;
        case 'authentication_required':
          message = 'Additional authentication is required. Please complete the verification.';
          break;
        default:
          message = error.message || message;
      }
    }

    Alert.alert('Payment Error', message);
  }

  static showBookingError(error: any) {
    let message = 'Booking failed. Please try again.';
    
    if (error.code) {
      switch (error.code) {
        case 'SLOT_UNAVAILABLE':
          message = 'This time slot is no longer available. Please select another time.';
          break;
        case 'PROVIDER_UNAVAILABLE':
          message = 'The provider is not available at this time. Please try again later.';
          break;
        case 'PAYMENT_REQUIRED':
          message = 'Payment is required to complete this booking.';
          break;
        case 'BOOKING_EXISTS':
          message = 'You already have a booking at this time. Please choose a different time.';
          break;
        default:
          message = error.message || message;
      }
    }

    Alert.alert('Booking Error', message);
  }
}

export const handleApiError = (error: any): string => {
  return ErrorHandler.handle(error);
};

export const showError = (error: any, title?: string) => {
  ErrorHandler.showError(error, title);
};

export const showNetworkError = () => {
  ErrorHandler.showNetworkError();
};

export const showServerError = () => {
  ErrorHandler.showServerError();
};

export const showPaymentError = (error: any) => {
  ErrorHandler.showPaymentError(error);
};

export const showBookingError = (error: any) => {
  ErrorHandler.showBookingError(error);
};