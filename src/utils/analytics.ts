/**
 * Basic Analytics Utility
 * 
 * This is a lightweight analytics wrapper that can be extended
 * to integrate with Firebase Analytics, Mixpanel, Amplitude, etc.
 */

const ENABLE_ANALYTICS = process.env.EXPO_PUBLIC_ANALYTICS_ENABLED === 'true';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

class Analytics {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = ENABLE_ANALYTICS && !__DEV__;
  }

  /**
   * Track an event
   */
  track(eventName: string, properties?: Record<string, any>) {
    if (!this.isEnabled) {
      if (__DEV__) {
        console.log('[Analytics]', eventName, properties);
      }
      return;
    }

    // TODO: Integrate with your analytics provider
    // Example: Firebase Analytics
    // analytics().logEvent(eventName, properties);
    
    // Example: Mixpanel
    // mixpanel.track(eventName, properties);
    
    console.log('[Analytics]', eventName, properties);
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>) {
    if (!this.isEnabled) return;
    
    // TODO: Set user properties in analytics service
    console.log('[Analytics] Set User Properties', properties);
  }

  /**
   * Set user ID
   */
  setUserId(userId: string | null) {
    if (!this.isEnabled) return;
    
    // TODO: Set user ID in analytics service
    console.log('[Analytics] Set User ID', userId);
  }

  /**
   * Track screen view
   */
  trackScreenView(screenName: string, properties?: Record<string, any>) {
    this.track(`screen_view_${screenName}`, {
      screen_name: screenName,
      ...properties,
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, properties?: Record<string, any>) {
    this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...properties,
    });
  }
}

export const analytics = new Analytics();

// Common event names
export const Events = {
  // Auth
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  SIGNIN_COMPLETED: 'signin_completed',
  SIGNOUT: 'signout',
  
  // Booking
  BOOKING_STARTED: 'booking_started',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',
  
  // Payments
  PAYMENT_STARTED: 'payment_started',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',
  
  // Content
  TRANSFORMATION_CREATED: 'transformation_created',
  TRANSFORMATION_SHARED: 'transformation_shared',
  REVIEW_SUBMITTED: 'review_submitted',
  
  // Navigation
  SCREEN_VIEW: 'screen_view',
};

export default analytics;