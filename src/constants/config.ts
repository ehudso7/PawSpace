
  storage: {
    buckets: {
      avatars: 'avatars',
      transformations: 'transformations',
      services: 'services',
    },
  },
  features: {
    analytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
    pushNotifications: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
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
    },
    bio: {
      maxLength: 500,
    },
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
