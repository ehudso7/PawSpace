import * as Sentry from 'sentry-expo';

class ErrorTrackingService {
  init() {
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your actual DSN
      enableInExpoDevelopment: true,
      debug: __DEV__,
    });
  }

  captureException(error: Error, context?: any) {
    if (context) {
      Sentry.Native.setContext('error_context', context);
    }
    Sentry.Native.captureException(error);
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    Sentry.Native.captureMessage(message, level);
  }

  setUser(user: { id: string; email?: string; username?: string }) {
    Sentry.Native.setUser(user);
  }

  addBreadcrumb(message: string, category?: string, level?: string) {
    Sentry.Native.addBreadcrumb({
      message,
      category: category || 'default',
      level: level || 'info',
    });
  }

  setTag(key: string, value: string) {
    Sentry.Native.setTag(key, value);
  }

  setContext(key: string, context: any) {
    Sentry.Native.setContext(key, context);
  }

  // Wrapper for async operations
  async withErrorTracking<T>(
    operation: () => Promise<T>,
    operationName: string,
    context?: any
  ): Promise<T> {
    try {
      this.addBreadcrumb(`Starting ${operationName}`, 'operation');
      const result = await operation();
      this.addBreadcrumb(`Completed ${operationName}`, 'operation');
      return result;
    } catch (error) {
      this.addBreadcrumb(`Failed ${operationName}`, 'operation', 'error');
      this.captureException(error as Error, {
        operation: operationName,
        ...context,
      });
      throw error;
    }
  }

  // Performance monitoring
  startTransaction(name: string, operation: string) {
    return Sentry.Native.startTransaction({ name, op: operation });
  }
}

export const errorTrackingService = new ErrorTrackingService();