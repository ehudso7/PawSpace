import * as Analytics from 'expo-firebase-analytics';

export class AnalyticsService {
  logEvent(name: string, params?: object) {
    Analytics.logEvent(name, params);
  }

  logScreenView(screenName: string) {
    // setCurrentScreen is deprecated in favor of logEvent with screen_view; but Expo SDK exposes it
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
