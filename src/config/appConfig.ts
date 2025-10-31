import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Environment configuration
const getEnvVar = (key: string, fallback: string = ''): string => {
  return process.env[key] || Constants.expoConfig?.extra?.[key] || fallback;
};

// App Configuration
export const APP_CONFIG = {
  name: 'PawSpace',
  version: '1.0.0',
  bundleId: Platform.select({
    ios: 'com.pawspace.app',
    android: 'com.pawspace.app',
  }),
  scheme: 'pawspace',
  
  // API Configuration
  api: {
    baseUrl: getEnvVar('EXPO_PUBLIC_API_BASE_URL', ''),
    timeout: 10000,
    retryAttempts: 3,
  },
  
  // Supabase Configuration
  supabase: {
    url: getEnvVar('EXPO_PUBLIC_SUPABASE_URL', ''),
    anonKey: getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY', ''),
  },
  
  // Stripe Configuration
  stripe: {
    publishableKey: getEnvVar('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY', ''),
    merchantId: 'merchant.com.pawspace.app',
    urlScheme: 'pawspace',
  },
  
  // Storage Configuration
  storage: {
    buckets: {
      avatars: 'avatars',
      transformations: 'transformations',
      services: 'services',
    },
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  
  // Feature Flags
  features: {
    enablePushNotifications: getEnvVar('EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS', 'true') === 'true',
    enableAnalytics: getEnvVar('EXPO_PUBLIC_ENABLE_ANALYTICS', 'true') === 'true',
    enableCrashReporting: getEnvVar('EXPO_PUBLIC_ENABLE_CRASH_REPORTING', 'true') === 'true',
    enableSocialSharing: true,
    enableVideoTransformations: getEnvVar('EXPO_PUBLIC_ENABLE_VIDEO_TRANSFORMATIONS', 'false') === 'true',
    enableLiveChat: getEnvVar('EXPO_PUBLIC_ENABLE_LIVE_CHAT', 'true') === 'true',
  },
  
  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  
  // Validation Rules
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
    },
    username: {
      minLength: 3,
      maxLength: 30,
      allowedChars: /^[a-zA-Z0-9_.-]+$/,
    },
    email: {
      minLength: 5,
      maxLength: 255,
    },
  },
  
  // Debug Mode
  debug: getEnvVar('EXPO_PUBLIC_DEBUG_MODE', 'false') === 'true',
  
  // Environment
  env: getEnvVar('EXPO_PUBLIC_APP_ENV', 'development'),
};

// Validate required configuration
export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!APP_CONFIG.supabase.url) {
    errors.push('EXPO_PUBLIC_SUPABASE_URL is required');
  }
  
  if (!APP_CONFIG.supabase.anonKey) {
    errors.push('EXPO_PUBLIC_SUPABASE_ANON_KEY is required');
  }
  
  if (!APP_CONFIG.api.baseUrl && APP_CONFIG.env === 'production') {
    errors.push('EXPO_PUBLIC_API_BASE_URL is required for production');
  }
  
  if (!APP_CONFIG.stripe.publishableKey && APP_CONFIG.env === 'production') {
    errors.push('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY is required for production');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// Export API URL helper
export const getApiUrl = (path: string): string => {
  const baseUrl = APP_CONFIG.api.baseUrl;
  if (!baseUrl) {
    throw new Error('API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL');
  }
  if (!path.startsWith('/')) {
    return `${baseUrl}/${path}`;
  }
  return `${baseUrl}${path}`;
};

export default APP_CONFIG;
