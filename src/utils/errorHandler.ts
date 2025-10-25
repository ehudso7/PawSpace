import { Alert } from 'react-native';

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  retryable?: boolean;
}

export class NetworkError extends Error implements AppError {
  code = 'NETWORK_ERROR';
  retryable = true;
  
  constructor(message = 'Network connection failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class CloudinaryError extends Error implements AppError {
  code = 'CLOUDINARY_ERROR';
  retryable = true;
  statusCode?: number;
  
  constructor(message = 'Cloudinary service error', statusCode?: number) {
    super(message);
    this.name = 'CloudinaryError';
    this.statusCode = statusCode;
  }
}

export class ValidationError extends Error implements AppError {
  code = 'VALIDATION_ERROR';
  retryable = false;
  
  constructor(message = 'Invalid input provided') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class PermissionError extends Error implements AppError {
  code = 'PERMISSION_ERROR';
  retryable = false;
  
  constructor(message = 'Permission denied') {
    super(message);
    this.name = 'PermissionError';
  }
}

export class StorageError extends Error implements AppError {
  code = 'STORAGE_ERROR';
  retryable = true;
  
  constructor(message = 'Storage operation failed') {
    super(message);
    this.name = 'StorageError';
  }
}

export class GenerationTimeoutError extends Error implements AppError {
  code = 'GENERATION_TIMEOUT';
  retryable = true;
  
  constructor(message = 'Video generation timed out') {
    super(message);
    this.name = 'GenerationTimeoutError';
  }
}

/**
 * Error handler utility class
 */
export class ErrorHandler {
  /**
   * Handle and display error to user
   */
  static handleError(error: unknown, context?: string): AppError {
    const appError = this.normalizeError(error);
    
    console.error(`Error in ${context || 'unknown context'}:`, {
      name: appError.name,
      message: appError.message,
      code: appError.code,
      stack: appError.stack,
    });

    this.showUserFriendlyError(appError, context);
    
    return appError;
  }

  /**
   * Convert unknown error to AppError
   */
  static normalizeError(error: unknown): AppError {
    if (error instanceof Error) {
      // Already an AppError
      if ('code' in error) {
        return error as AppError;
      }
      
      // Network errors
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        return new NetworkError(error.message);
      }
      
      // Permission errors
      if (error.message.includes('permission') || error.message.includes('denied')) {
        return new PermissionError(error.message);
      }
      
      // Timeout errors
      if (error.message.includes('timeout') || error.message.includes('timed out')) {
        return new GenerationTimeoutError(error.message);
      }
      
      // Generic error
      const appError = new Error(error.message) as AppError;
      appError.code = 'UNKNOWN_ERROR';
      appError.retryable = false;
      return appError;
    }
    
    // String error
    if (typeof error === 'string') {
      const appError = new Error(error) as AppError;
      appError.code = 'UNKNOWN_ERROR';
      appError.retryable = false;
      return appError;
    }
    
    // Unknown error type
    const appError = new Error('An unexpected error occurred') as AppError;
    appError.code = 'UNKNOWN_ERROR';
    appError.retryable = false;
    return appError;
  }

  /**
   * Show user-friendly error message
   */
  static showUserFriendlyError(error: AppError, context?: string) {
    const title = this.getErrorTitle(error);
    const message = this.getErrorMessage(error, context);
    const buttons = this.getErrorButtons(error);

    Alert.alert(title, message, buttons);
  }

  /**
   * Get user-friendly error title
   */
  private static getErrorTitle(error: AppError): string {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Connection Error';
      case 'CLOUDINARY_ERROR':
        return 'Upload Error';
      case 'VALIDATION_ERROR':
        return 'Invalid Input';
      case 'PERMISSION_ERROR':
        return 'Permission Required';
      case 'STORAGE_ERROR':
        return 'Storage Error';
      case 'GENERATION_TIMEOUT':
        return 'Generation Timeout';
      default:
        return 'Error';
    }
  }

  /**
   * Get user-friendly error message
   */
  private static getErrorMessage(error: AppError, context?: string): string {
    const baseMessage = this.getBaseErrorMessage(error);
    const contextMessage = context ? ` while ${context}` : '';
    const retryMessage = error.retryable ? '\n\nPlease try again.' : '';
    
    return `${baseMessage}${contextMessage}${retryMessage}`;
  }

  /**
   * Get base error message for error type
   */
  private static getBaseErrorMessage(error: AppError): string {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect to the server. Please check your internet connection.';
      case 'CLOUDINARY_ERROR':
        return 'Failed to upload or process your images. This might be due to file size or format issues.';
      case 'VALIDATION_ERROR':
        return 'The provided information is invalid or incomplete.';
      case 'PERMISSION_ERROR':
        return 'This app needs permission to access your photos and camera to create transformations.';
      case 'STORAGE_ERROR':
        return 'Unable to save or access files on your device. Please check available storage space.';
      case 'GENERATION_TIMEOUT':
        return 'Video generation is taking longer than expected. This might be due to server load.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  /**
   * Get appropriate alert buttons for error type
   */
  private static getErrorButtons(error: AppError): any[] {
    const buttons = [{ text: 'OK' }];
    
    if (error.retryable) {
      buttons.unshift({ text: 'Retry', style: 'default' });
    }
    
    if (error.code === 'PERMISSION_ERROR') {
      buttons.unshift({ text: 'Settings', style: 'default' });
    }
    
    return buttons;
  }

  /**
   * Log error for analytics/debugging
   */
  static logError(error: AppError, context?: string, metadata?: Record<string, any>) {
    // In production, send to analytics service (Firebase, Sentry, etc.)
    console.error('Error logged:', {
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        retryable: error.retryable,
        statusCode: error.statusCode,
      },
      context,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Create retry function with exponential backoff
   */
  static createRetryFunction<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): () => Promise<T> {
    return async () => {
      let lastError: AppError;
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await fn();
        } catch (error) {
          lastError = this.normalizeError(error);
          
          if (!lastError.retryable || attempt === maxAttempts) {
            throw lastError;
          }
          
          const delay = baseDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      throw lastError!;
    };
  }
}

/**
 * Utility function to wrap async operations with error handling
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw ErrorHandler.handleError(error, context);
    }
  };
}

/**
 * Utility function to create safe async operations
 */
export function safeAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  fallback: R,
  context?: string
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      ErrorHandler.handleError(error, context);
      return fallback;
    }
  };
}