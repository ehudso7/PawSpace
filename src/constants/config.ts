import { Platform } from 'react-native';

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
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.pawspace.com',
    timeout: 10000,
    retryAttempts: 3,
  },
  
  // Supabase Configuration
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
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
    enablePushNotifications: true,
    enableAnalytics: true,
    enableCrashReporting: true,
    enableInAppPurchases: true,
    enableSocialSharing: true,
    enableVideoTransformations: false, // Future feature
    enableLiveChat: true,
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
    bio: {
      maxLength: 500,
    },
    caption: {
      maxLength: 2000,
    },
    review: {
      maxLength: 1000,
    },
  },
  
  // Map Configuration
  map: {
    defaultRegion: {
      latitude: 37.7749,
      longitude: -122.4194,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    searchRadius: 25, // kilometers
  },
  
  // Booking Configuration
  booking: {
    maxAdvanceBookingDays: 90,
    minAdvanceBookingHours: 2,
    cancellationPolicyHours: 24,
    timeSlotDuration: 60, // minutes
    workingHours: {
      start: '09:00',
      end: '18:00',
    },
  },
  
  // Subscription Plans
  subscriptionPlans: {
    free: {
      name: 'Free',
      price: 0,
      features: [
        'Basic transformations',
        'Limited uploads per month',
        'Community access',
      ],
      limits: {
        uploadsPerMonth: 5,
        storageGB: 1,
      },
    },
    premium: {
      name: 'Premium',
      price: 9.99,
      features: [
        'Advanced transformations',
        'Unlimited uploads',
        'Priority support',
        'Ad-free experience',
      ],
      limits: {
        uploadsPerMonth: -1, // unlimited
        storageGB: 10,
      },
    },
    pro: {
      name: 'Pro',
      price: 19.99,
      features: [
        'All Premium features',
        'Business tools',
        'Analytics dashboard',
        'Custom branding',
      ],
      limits: {
        uploadsPerMonth: -1, // unlimited
        storageGB: 50,
      },
    },
  },
  
  // Social Media Links
  socialMedia: {
    website: 'https://pawspace.com',
    instagram: 'https://instagram.com/pawspace',
    twitter: 'https://twitter.com/pawspace',
    facebook: 'https://facebook.com/pawspace',
    support: 'mailto:support@pawspace.com',
    privacy: 'https://pawspace.com/privacy',
    terms: 'https://pawspace.com/terms',
  },
  
  // Analytics Events
  analytics: {
    events: {
      // Auth Events
      USER_SIGNED_UP: 'user_signed_up',
      USER_SIGNED_IN: 'user_signed_in',
      USER_SIGNED_OUT: 'user_signed_out',
      
      // Transformation Events
      TRANSFORMATION_CREATED: 'transformation_created',
      TRANSFORMATION_LIKED: 'transformation_liked',
      TRANSFORMATION_SHARED: 'transformation_shared',
      
      // Booking Events
      SERVICE_VIEWED: 'service_viewed',
      BOOKING_CREATED: 'booking_created',
      BOOKING_CANCELLED: 'booking_cancelled',
      
      // Subscription Events
      SUBSCRIPTION_STARTED: 'subscription_started',
      SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
      
      // Error Events
      API_ERROR: 'api_error',
      CRASH: 'crash',
    },
  },
  
  // Push Notification Categories
  notifications: {
    categories: {
      BOOKING: 'booking',
      SOCIAL: 'social',
      MARKETING: 'marketing',
      SYSTEM: 'system',
    },
  },
  
  // Development Configuration
  development: {
    enableDebugMode: __DEV__,
    enableReduxLogger: __DEV__,
    enableNetworkLogger: __DEV__,
    showPerformanceMonitor: __DEV__,
  },
};

// Environment-specific overrides
if (__DEV__) {
  // Development overrides
  APP_CONFIG.api.baseUrl = process.env.EXPO_PUBLIC_DEV_API_BASE_URL || APP_CONFIG.api.baseUrl;
}

export default APP_CONFIG;
