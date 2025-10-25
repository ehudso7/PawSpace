<<<<<<< HEAD
# PawSpace - Pet Services Marketplace

A React Native Expo TypeScript application for pet services marketplace with social features.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy the environment variables:
```bash
cp .env.example .env
```

3. Update the `.env` file with your Supabase credentials and other configuration values.

### Running the App

Start the development server:
```bash
npm start
```

Run on specific platforms:
```bash
npm run ios      # Run on iOS
npm run android  # Run on Android
npm run web      # Run on web
```

## 📁 Project Structure

```
src/
├── navigation/          # Navigation configuration
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── TabNavigator.tsx
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── home/          # Home/feed screens
│   ├── booking/       # Booking screens
│   ├── create/        # Content creation screens
│   └── profile/       # Profile screens
=======
# PawSpace

A React Native Expo TypeScript app for pet services marketplace with social features.

## Features

- **Pet Transformations Feed**: Browse before/after photos of pet transformations
- **Service Booking**: Book grooming, training, walking, and other pet services
- **Provider Profiles**: View and rate service providers
- **Social Features**: Like and share transformation posts
- **User Profiles**: Manage your profile and subscription

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **Supabase** for backend services
- **React Navigation** for navigation
- **Expo Image Picker** for image handling

## Project Structure

```
src/
├── navigation/          # Navigation components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── home/          # Home and feed screens
│   ├── booking/       # Booking related screens
│   ├── create/        # Content creation screens
│   └── profile/       # Profile and settings screens
>>>>>>> origin/main
├── components/         # Reusable components
│   ├── common/        # Common UI components
│   ├── feed/          # Feed-specific components
│   └── booking/       # Booking-specific components
<<<<<<< HEAD
├── services/          # API services
│   ├── supabase.ts
│   ├── auth.ts
│   ├── bookings.ts
│   ├── transformations.ts
│   └── storage.ts
├── hooks/             # Custom React hooks
│   ├── useAuth.ts
│   ├── useBookings.ts
│   └── useTransformations.ts
├── types/             # TypeScript type definitions
│   ├── index.ts
│   ├── database.ts
│   └── navigation.ts
├── constants/         # App constants
│   ├── theme.ts
│   └── config.ts
└── utils/            # Utility functions
    ├── validators.ts
    └── formatters.ts
```

## 🎨 Features

- **Authentication**: Sign up, login, and user management
- **Social Feed**: View and share pet transformation photos
- **Service Booking**: Browse and book pet services
- **Provider Profiles**: View service provider information
- **Content Creation**: Create and edit pet transformation posts
- **Profile Management**: Manage user profile and settings
- **Subscriptions**: Premium features and subscription management

## 🛠️ Technologies

- **React Native**: Mobile app framework
- **Expo**: Development platform
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **Supabase**: Backend and database
- **Supabase Storage**: File storage

## 📝 Code Style

This project uses TypeScript strict mode. Make sure to:
- Define proper types for all props and state
- Use barrel exports (index.ts) for cleaner imports
- Follow the established folder structure
- Use path aliases (@/components, @/screens, etc.)

## 🔧 Configuration

### Path Aliases

The following path aliases are configured in `tsconfig.json`:

- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/screens/*` → `./src/screens/*`
- `@/navigation/*` → `./src/navigation/*`
- `@/services/*` → `./src/services/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/types/*` → `./src/types/*`
- `@/constants/*` → `./src/constants/*`
- `@/utils/*` → `./src/utils/*`

### Environment Variables

Required environment variables (see `.env.example`):

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `EXPO_PUBLIC_API_URL`: API base URL
- `EXPO_PUBLIC_ENV`: Environment (development/staging/production)

## 📱 Screens

### Authentication
- Onboarding
- Login
- Signup

### Home
- Feed (transformation posts)
- Transformation detail

### Booking
- Service list
- Provider profile
- Booking calendar
- Booking confirmation
- My bookings

### Create
- Image selector
- Editor
- Preview

### Profile
- Profile view
- Edit profile
- Settings
- Subscription

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 👥 Team

Built with ❤️ by the PawSpace team
=======
├── services/          # API and external services
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── constants/         # App constants and configuration
└── utils/             # Utility functions
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials and other configuration.

3. Start the development server:
   ```bash
   npm start
   ```

## Environment Variables

See `.env.example` for required environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- Other configuration variables

## Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Run on Android device/emulator
- `npm run ios`: Run on iOS device/simulator
- `npm run web`: Run in web browser
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript type checking

## TypeScript Configuration

The project uses strict TypeScript configuration with path aliases:
- `@/` maps to `src/`
- `@/components` maps to `src/components`
- And so on for other directories

## Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript for all new code
3. Add proper type definitions
4. Follow the component structure in existing files
>>>>>>> origin/main
