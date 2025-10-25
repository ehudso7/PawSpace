# PawSpace - Pet Social Network

A React Native app for pet owners to connect, share, and book pet services.

## Features

- **Authentication Flow**: Complete auth system with Supabase integration
- **Navigation System**: 
  - Tab-based navigation with 4 main sections
  - Stack navigators for each tab
  - Deep linking support
  - Type-safe navigation with TypeScript
- **Screens**:
  - Home: Feed of pet posts and activities
  - Book: Browse and book pet services
  - Create: Create posts and offer services
  - Profile: User profile and settings

## Navigation Structure

```
AppNavigator
├── AuthNavigator (when not authenticated)
│   ├── OnboardingScreen
│   ├── LoginScreen
│   └── SignupScreen
└── TabNavigator (when authenticated)
    ├── HomeStack
    │   ├── FeedScreen
    │   ├── PostDetailScreen
    │   └── UserProfileScreen
    ├── BookStack
    │   ├── ServiceListScreen
    │   ├── ServiceDetailScreen
    │   ├── BookingFormScreen
    │   └── BookingConfirmationScreen
    ├── CreateStack
    │   ├── ImageSelectorScreen
    │   ├── PostEditorScreen
    │   └── ServiceEditorScreen
    └── ProfileStack
        ├── ProfileScreen
        ├── EditProfileScreen
        ├── SettingsScreen
        ├── MyBookingsScreen
        ├── MyServicesScreen
        └── NotificationsScreen
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Supabase**:
   - Update `src/lib/supabase.ts` with your Supabase project URL and anon key
   - Set environment variables:
     ```bash
     EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

3. **iOS Setup** (if targeting iOS):
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the App**:
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## Key Features

### Authentication
- Automatic session management with Supabase
- Loading states during auth checks
- Deep linking support for auth flows

### Navigation
- Type-safe navigation with TypeScript
- Platform-specific tab bar styling
- Smooth transitions and animations
- Proper header management for detail screens

### Deep Linking
- Support for URLs like `pawspace://post/123`
- Automatic navigation based on authentication state
- Configurable URL schemes

## Dependencies

- React Navigation 6.x
- React Native Paper (Material Design 3)
- Supabase for authentication
- React Native Vector Icons
- React Native Gesture Handler
- React Native Reanimated

## Project Structure

```
src/
├── navigation/
│   ├── AppNavigator.tsx      # Main navigator with auth logic
│   ├── AuthNavigator.tsx     # Authentication flow
│   └── TabNavigator.tsx      # Main tab navigation
├── screens/
│   ├── auth/                 # Authentication screens
│   ├── home/                 # Home/Feed screens
│   ├── book/                 # Service booking screens
│   ├── create/               # Content creation screens
│   └── profile/              # Profile and settings screens
├── types/
│   └── navigation.ts         # TypeScript navigation types
├── lib/
│   └── supabase.ts          # Supabase configuration
├── theme.ts                 # App theme configuration
└── App.tsx                  # Main app component
```