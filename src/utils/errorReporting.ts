/**
 * Error Reporting Utility
 * 
 * This can be extended to integrate with Sentry, Bugsnag, or other crash reporting services
 */

const ENABLE_ERROR_REPORTING = !__DEV__; // Only in production

class ErrorReporter {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = ENABLE_ERROR_REPORTING;
  }

  /**
   * Report an error
   */
  captureException(error: Error, context?: Record<string, any>) {
    if (!this.isEnabled) {
      console.error('[Error Reporter]', error, context);
      return;
    }

    // TODO: Integrate with crash reporting service
    // Example: Sentry
    // Sentry.captureException(error, { extra: context });
    
    // Example: Bugsnag
    // Bugsnag.notify(error, (event) => {
    //   event.addMetadata('context', context);
    // });

    console.error('[Error Reporter]', error, context);
  }

  /**
   * Report a message
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'error', context?: Record<string, any>) {
    if (!this.isEnabled) {
      console[level === 'info' ? 'log' : level === 'warning' ? 'warn' : 'error']('[Error Reporter]', message, context);
      return;
    }

    // TODO: Integrate with crash reporting service
    console[level === 'info' ? 'log' : level === 'warning' ? 'warn' : 'error']('[Error Reporter]', message, context);
  }

  /**
   * Set user context
   */
  setUser(user: { id?: string; email?: string; username?: string } | null) {
    if (!this.isEnabled) return;

    // TODO: Set user in crash reporting service
    // Example: Sentry
    // Sentry.setUser(user);
    
    console.log('[Error Reporter] Set User', user);
  }
}

export const errorReporter = new ErrorReporter();

export default errorReporter;