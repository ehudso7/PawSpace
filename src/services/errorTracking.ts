import * as Sentry from 'sentry-expo';

class ErrorTrackingService {
  initialize(dsn: string, environment: 'development' | 'staging' | 'production') {
    Sentry.init({
      dsn,
      enableInExpoDevelopment: true,
      debug: environment === 'development',
      environment,
      tracesSampleRate: 1.0,
    });
  }

  captureException(error: Error, context?: Record<string, any>) {
    Sentry.Native.captureException(error, {
      extra: context,
    });
    console.error('Error captured:', error, context);
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    Sentry.Native.captureMessage(message, level);
  }

  setUser(user: { id: string; email?: string; username?: string }) {
    Sentry.Native.setUser(user);
  }

  clearUser() {
    Sentry.Native.setUser(null);
  }

  addBreadcrumb(category: string, message: string, data?: Record<string, any>) {
    Sentry.Native.addBreadcrumb({
      category,
      message,
      data,
      level: 'info',
    });
  }

  setTag(key: string, value: string) {
    Sentry.Native.setTag(key, value);
  }

  setContext(name: string, context: Record<string, any>) {
    Sentry.Native.setContext(name, context);
  }

  // Wrapper for async operations with automatic error tracking
  async wrapAsync<T>(
    operation: () => Promise<T>,
    operationName: string,
    context?: Record<string, any>
  ): Promise<T> {
    try {
      this.addBreadcrumb('operation', `Starting ${operationName}`, context);
      const result = await operation();
      this.addBreadcrumb('operation', `Completed ${operationName}`, context);
      return result;
    } catch (error) {
      this.captureException(error as Error, {
        operation: operationName,
        ...context,
      });
      throw error;
    }
  }

  // Wrapper for sync operations with automatic error tracking
  wrapSync<T>(
    operation: () => T,
    operationName: string,
    context?: Record<string, any>
  ): T {
    try {
      this.addBreadcrumb('operation', `Starting ${operationName}`, context);
      const result = operation();
      this.addBreadcrumb('operation', `Completed ${operationName}`, context);
      return result;
    } catch (error) {
      this.captureException(error as Error, {
        operation: operationName,
        ...context,
      });
      throw error;
    }
  }
}

export const errorTrackingService = new ErrorTrackingService();
export { Sentry };
