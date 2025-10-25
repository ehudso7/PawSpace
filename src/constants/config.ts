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
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  },
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
