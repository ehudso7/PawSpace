import * as Analytics from 'expo-firebase-analytics';

export class AnalyticsService {
  logEvent(name: string, params?: Record<string, any>) {
    Analytics.logEvent(name, params);
  }

  logScreenView(screenName: string) {
    // setCurrentScreen is deprecated in the Firebase SDK v10+, but expo wrapper keeps compatibility
    // @ts-ignore
    Analytics.setCurrentScreen(screenName);
  }

  setUserId(userId: string) {
    Analytics.setUserId(userId);
  }

  setUserProperty(name: string, value: string) {
    Analytics.setUserProperty(name, value);
  }
}

export const AnalyticsEvents = {
  UserSignup: 'user_signup',
  BookingCreated: 'booking_created',
  TransformationPosted: 'transformation_posted',
  SubscriptionPurchased: 'subscription_purchased',
  ServiceViewed: 'service_viewed',
} as const;
