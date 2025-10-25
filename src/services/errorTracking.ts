import * as Sentry from 'sentry-expo';

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private isInitialized = false;

  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  initialize() {
    if (this.isInitialized) return;

    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || 'YOUR_SENTRY_DSN',
      enableInExpoDevelopment: true,
      debug: __DEV__,
    });

    this.isInitialized = true;
  }

  captureException(error: Error, context?: any) {
    try {
      Sentry.Native.captureException(error, {
        extra: context,
      });
    } catch (sentryError) {
      console.error('Failed to capture exception in Sentry:', sentryError);
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: any) {
    try {
      Sentry.Native.captureMessage(message, {
        level,
        extra: context,
      });
    } catch (sentryError) {
      console.error('Failed to capture message in Sentry:', sentryError);
    }
  }

  setUser(user: { id: string; email?: string; username?: string }) {
    try {
      Sentry.Native.setUser(user);
    } catch (error) {
      console.error('Failed to set user in Sentry:', error);
    }
  }

  setTag(key: string, value: string) {
    try {
      Sentry.Native.setTag(key, value);
    } catch (error) {
      console.error('Failed to set tag in Sentry:', error);
    }
  }

  setContext(key: string, context: any) {
    try {
      Sentry.Native.setContext(key, context);
    } catch (error) {
      console.error('Failed to set context in Sentry:', error);
    }
  }

  addBreadcrumb(message: string, category: string, level: 'info' | 'warning' | 'error' = 'info', data?: any) {
    try {
      Sentry.Native.addBreadcrumb({
        message,
        category,
        level,
        data,
        timestamp: Date.now() / 1000,
      });
    } catch (error) {
      console.error('Failed to add breadcrumb in Sentry:', error);
    }
  }

  // Helper method to wrap async functions with error tracking
  async withErrorTracking<T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      this.captureException(error as Error, { context });
      return null;
    }
  }

  // Helper method to wrap sync functions with error tracking
  withErrorTrackingSync<T>(
    fn: () => T,
    context?: string
  ): T | null {
    try {
      return fn();
    } catch (error) {
      this.captureException(error as Error, { context });
      return null;
    }
  }
}

export default ErrorTrackingService;