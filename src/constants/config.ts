<<<<<<< HEAD
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
=======
<<<<<<< HEAD
// App configuration constants
export const config = {
  app: {
    name: 'PawSpace',
    version: '1.0.0',
    description: 'A pet services marketplace with social features',
  },
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || '',
    timeout: 30000,
  },
>>>>>>> origin/main
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  },
<<<<<<< HEAD
  
  // Storage Configuration
=======
>>>>>>> origin/main
  storage: {
    buckets: {
      avatars: 'avatars',
      transformations: 'transformations',
      services: 'services',
    },
<<<<<<< HEAD
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
=======
  },
  features: {
    analytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
    pushNotifications: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
  },
>>>>>>> origin/main
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
<<<<<<< HEAD
  
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
=======
  validation: {
    email: {
      minLength: 5,
      maxLength: 255,
    },
    password: {
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecialChar: false,
    },
    name: {
      minLength: 2,
      maxLength: 50,
>>>>>>> origin/main
    },
    bio: {
      maxLength: 500,
    },
<<<<<<< HEAD
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
=======
  },
  booking: {
    minAdvanceBooking: 24, // hours
    maxAdvanceBooking: 90, // days
    cancellationWindow: 24, // hours
  },
};

export default config;
=======
import Constants from 'expo-constants';

export const config = {
  app: {
    name: Constants.expoConfig?.extra?.appName || 'PawSpace',
    version: Constants.expoConfig?.extra?.appVersion || '1.0.0',
  },
  api: {
    baseUrl: Constants.expoConfig?.extra?.apiBaseUrl || 'https://api.pawspace.com',
    timeout: Constants.expoConfig?.extra?.apiTimeout || 10000,
  },
  storage: {
    bucket: Constants.expoConfig?.extra?.storageBucket || 'pawspace-images',
    maxImageSize: Constants.expoConfig?.extra?.maxImageSize || 5242880, // 5MB
  },
  features: {
    socialFeatures: Constants.expoConfig?.extra?.enableSocialFeatures !== false,
    debugMode: Constants.expoConfig?.extra?.debugMode === true,
  },
  supabase: {
    url: Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export const serviceCategories = [
  'Grooming',
  'Training',
  'Walking',
  'Boarding',
  'Veterinary',
  'Pet Sitting',
  'Photography',
  'Other',
] as const;

export const transformationCategories = [
  'Before & After',
  'Grooming',
  'Training Progress',
  'Health Journey',
  'Weight Loss',
  'Behavior Change',
  'Other',
] as const;

export const bookingStatuses = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
] as const;
>>>>>>> origin/main
>>>>>>> origin/main
