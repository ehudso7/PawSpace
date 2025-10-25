import * as Analytics from 'expo-firebase-analytics';

export class AnalyticsService {
  logEvent(name: string, params?: object) {
    Analytics.logEvent(name, params);
  }

  logScreenView(screenName: string) {
    Analytics.logEvent('screen_view', { screen_name: screenName });
  }

  setUserId(userId: string) {
    Analytics.setUserId(userId);
  }

  setUserProperty(name: string, value: string) {
    Analytics.setUserProperty(name, value);
  }
}

export const analytics = new AnalyticsService();
