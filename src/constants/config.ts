import { Platform } from 'react-native';

export const APP_CONFIG = {
  name: 'PawSpace',
  version: '1.0.0',
  bundleId: Platform.select({ ios: 'com.pawspace.app', android: 'com.pawspace.app' }),
  scheme: 'pawspace',
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.pawspace.com',
    timeout: 10000,
    retryAttempts: 3,
  },
  storage: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  booking: {
    maxAdvanceBookingDays: 90,
    minAdvanceBookingHours: 2,
  },
  features: {
    enablePushNotifications: true,
    enableAnalytics: true,
  },
};

if (process.env.EXPO_PUBLIC_DEV_API_BASE_URL) {
  APP_CONFIG.api.baseUrl = process.env.EXPO_PUBLIC_DEV_API_BASE_URL;
}

export default APP_CONFIG;
