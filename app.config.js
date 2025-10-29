import 'dotenv/config';

export default {
  expo: {
    name: 'PawSpace',
    slug: 'pawspace',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    scheme: 'pawspace',
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.pawspace.app',
      buildNumber: '1',
      infoPlist: {
        NSCameraUsageDescription:
          'PawSpace needs access to your camera to capture and share pet transformations.',
        NSPhotoLibraryUsageDescription:
          'PawSpace needs access to your photo library to select and share pet photos.',
        NSLocationWhenInUseUsageDescription:
          'PawSpace uses your location to find nearby pet service providers.',
        NSMicrophoneUsageDescription:
          'PawSpace needs access to your microphone for video features.',
      },
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.pawspace.app',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      [
        'expo-camera',
        {
          cameraPermission:
            'Allow PawSpace to access your camera to capture pet photos and videos.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'Allow PawSpace to access your photo library to select pet photos.',
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow PawSpace to use your location to find nearby pet services.',
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#6366F1',
          sounds: ['./assets/notification.wav'],
        },
      ],
    ],
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};