import * as Sentry from 'sentry-expo';

class ErrorTrackingService {
  initialize() {
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your actual Sentry DSN
      enableInExpoDevelopment: true,
      debug: __DEV__,
    });
  }
  
  captureException(error: Error, context?: string) {
    if (context) {
      Sentry.Native.setContext('error_context', { context });
    }
    Sentry.Native.captureException(error);
  }
  
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    Sentry.Native.captureMessage(message, level);
  }
  
  setUser(userId: string, email?: string, username?: string) {
    Sentry.Native.setUser({
      id: userId,
      email: email,
      username: username,
    });
  }
  
  setTag(key: string, value: string) {
    Sentry.Native.setTag(key, value);
  }
  
  setContext(key: string, context: any) {
    Sentry.Native.setContext(key, context);
  }
  
  addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error') {
    Sentry.Native.addBreadcrumb({
      message,
      category: category || 'user',
      level: level || 'info',
    });
  }
}

export const errorTrackingService = new ErrorTrackingService();
