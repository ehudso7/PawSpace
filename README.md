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
├── components/         # Reusable components
│   ├── common/        # Common UI components
│   ├── feed/          # Feed-specific components
│   └── booking/       # Booking-specific components
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