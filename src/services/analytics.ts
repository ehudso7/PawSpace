import React, { createContext, useContext, useMemo } from 'react';
import * as Analytics from 'expo-firebase-analytics';

export interface AnalyticsContextValue {
  logEvent: (name: string, params?: object) => void;
  logScreenView: (screenName: string) => void;
  setUserId: (userId: string) => void;
  setUserProperty: (name: string, value: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo<AnalyticsContextValue>(() => ({
    logEvent: (name: string, params?: object) => {
      Analytics.logEvent(name, params);
    },
    logScreenView: (screenName: string) => {
      // setCurrentScreen is deprecated; log screen view via event
      Analytics.logEvent('screen_view', { screen_name: screenName });
    },
    setUserId: (userId: string) => {
      Analytics.setUserId(userId);
    },
    setUserProperty: (name: string, value: string) => {
      Analytics.setUserProperty(name, value);
    },
  }), []);

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = (): AnalyticsContextValue => {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error('useAnalytics must be used within AnalyticsProvider');
  return ctx;
};
