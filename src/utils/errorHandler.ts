/**
 * Error Handling Utilities
 * Centralized error handling and user-friendly error messages
 */

import { Alert } from 'react-native';

export enum ErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  
  // Upload errors
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  
  // Generation errors
  GENERATION_FAILED = 'GENERATION_FAILED',
  GENERATION_TIMEOUT = 'GENERATION_TIMEOUT',
  
  // Permission errors
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  CAMERA_PERMISSION_DENIED = 'CAMERA_PERMISSION_DENIED',
  MEDIA_LIBRARY_PERMISSION_DENIED = 'MEDIA_LIBRARY_PERMISSION_DENIED',
  
  // API errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  
  // Sharing errors
  SHARE_FAILED = 'SHARE_FAILED',
  APP_NOT_INSTALLED = 'APP_NOT_INSTALLED',
  
  // Unknown
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  originalError?: Error;
  details?: any;
}

export class ErrorHandler {
  private static instance: ErrorHandler;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Convert any error to AppError
   */
  parseError(error: any): AppError {
    if (error?.code) {
      return error as AppError;
    }

    // Network errors
    if (error?.message?.includes('Network')) {
      return {
        code: ErrorCode.NETWORK_ERROR,
        message: 'Network connection error. Please check your internet.',
        originalError: error,
      };
    }

    if (error?.message?.includes('timeout')) {
      return {
        code: ErrorCode.TIMEOUT,
        message: 'Request timed out. Please try again.',
        originalError: error,
      };
    }

    // Upload errors
    if (error?.message?.includes('upload')) {
      return {
        code: ErrorCode.UPLOAD_FAILED,
        message: 'Failed to upload image. Please try again.',
        originalError: error,
      };
    }

    if (error?.message?.includes('too large') || error?.message?.includes('size')) {
      return {
        code: ErrorCode.FILE_TOO_LARGE,
        message: 'File is too large. Please choose a smaller image.',
        originalError: error,
      };
    }

    // Generation errors
    if (error?.message?.includes('generation')) {
      return {
        code: ErrorCode.GENERATION_FAILED,
        message: 'Failed to generate transformation. Please try again.',
        originalError: error,
      };
    }

    // Permission errors
    if (error?.message?.includes('permission')) {
      return {
        code: ErrorCode.PERMISSION_DENIED,
        message: 'Permission denied. Please grant access in settings.',
        originalError: error,
      };
    }

    // API errors
    if (error?.status === 401 || error?.message?.includes('unauthorized')) {
      return {
        code: ErrorCode.UNAUTHORIZED,
        message: 'Please log in to continue.',
        originalError: error,
      };
    }

    if (error?.status === 403) {
      return {
        code: ErrorCode.FORBIDDEN,
        message: 'You don\'t have permission to perform this action.',
        originalError: error,
      };
    }

    if (error?.status === 404) {
      return {
        code: ErrorCode.NOT_FOUND,
        message: 'Resource not found.',
        originalError: error,
      };
    }

    if (error?.status >= 500) {
      return {
        code: ErrorCode.SERVER_ERROR,
        message: 'Server error. Please try again later.',
        originalError: error,
      };
    }

    // Default unknown error
    return {
      code: ErrorCode.UNKNOWN,
      message: error?.message || 'An unexpected error occurred.',
      originalError: error,
    };
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: AppError | Error | any): string {
    const appError = this.parseError(error);
    return appError.message;
  }

  /**
   * Show error alert to user
   */
  showError(error: AppError | Error | any, title: string = 'Error'): void {
    const appError = this.parseError(error);
    
    Alert.alert(
      title,
      appError.message,
      [{ text: 'OK' }]
    );
  }

  /**
   * Show error with action
   */
  showErrorWithAction(
    error: AppError | Error | any,
    onRetry?: () => void,
    onCancel?: () => void
  ): void {
    const appError = this.parseError(error);
    
    const buttons: any[] = [];
    
    if (onRetry) {
      buttons.push({ text: 'Retry', onPress: onRetry });
    }
    
    buttons.push({
      text: 'Cancel',
      style: 'cancel',
      onPress: onCancel,
    });

    Alert.alert('Error', appError.message, buttons);
  }

  /**
   * Log error (for analytics/monitoring)
   */
  logError(error: AppError | Error | any, context?: string): void {
    const appError = this.parseError(error);
    
    console.error('Error:', {
      code: appError.code,
      message: appError.message,
      context,
      details: appError.details,
      originalError: appError.originalError,
      timestamp: new Date().toISOString(),
    });

    // Send to error tracking service (e.g., Sentry)
    // Sentry.captureException(appError.originalError || error, {
    //   extra: {
    //     code: appError.code,
    //     message: appError.message,
    //     context,
    //   },
    // });
  }

  /**
   * Handle specific error types with appropriate actions
   */
  handleError(error: any, context: string, onRetry?: () => void): void {
    const appError = this.parseError(error);
    
    // Log error
    this.logError(appError, context);

    // Handle specific error types
    switch (appError.code) {
      case ErrorCode.UNAUTHORIZED:
        Alert.alert(
          'Session Expired',
          'Please log in again to continue.',
          [{ text: 'OK', onPress: () => {
            // Navigate to login
            // navigation.navigate('Login');
          }}]
        );
        break;

      case ErrorCode.NETWORK_ERROR:
        this.showErrorWithAction(appError, onRetry);
        break;

      case ErrorCode.PERMISSION_DENIED:
      case ErrorCode.CAMERA_PERMISSION_DENIED:
      case ErrorCode.MEDIA_LIBRARY_PERMISSION_DENIED:
        Alert.alert(
          'Permission Required',
          appError.message,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Settings',
              onPress: () => {
                // Open app settings
                // Linking.openSettings();
              },
            },
          ]
        );
        break;

      case ErrorCode.FILE_TOO_LARGE:
        Alert.alert(
          'File Too Large',
          'Please choose a smaller image (max 10MB).',
          [{ text: 'OK' }]
        );
        break;

      default:
        if (onRetry) {
          this.showErrorWithAction(appError, onRetry);
        } else {
          this.showError(appError);
        }
    }
  }

  /**
   * Create custom error
   */
  createError(code: ErrorCode, message: string, details?: any): AppError {
    return {
      code,
      message,
      details,
    };
  }

  /**
   * Check if error is retryable
   */
  isRetryable(error: AppError | Error | any): boolean {
    const appError = this.parseError(error);
    
    const retryableCodes = [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.TIMEOUT,
      ErrorCode.UPLOAD_FAILED,
      ErrorCode.GENERATION_FAILED,
      ErrorCode.SERVER_ERROR,
    ];

    return retryableCodes.includes(appError.code);
  }
}

export const errorHandler = ErrorHandler.getInstance();

/**
 * Async wrapper with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: string,
  onError?: (error: AppError) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const appError = errorHandler.parseError(error);
    errorHandler.logError(appError, context);
    
    if (onError) {
      onError(appError);
    }
    
    return null;
  }
}

/**
 * Retry wrapper
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  
  throw lastError;
}
