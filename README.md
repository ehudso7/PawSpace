<<<<<<< HEAD
# PawSpace - Pet Services Marketplace & Social Platform

A React Native Expo TypeScript application for pet services booking and social sharing of pet transformations.

## 🐾 Features

- **Social Feed**: Share and discover pet transformations
- **Service Booking**: Find and book pet services (grooming, training, veterinary, etc.)
- **Provider Profiles**: Detailed service provider information with reviews
- **Image Editing**: Built-in photo editor for pet transformations
- **Real-time Chat**: Communication between pet owners and service providers
- **Subscription Plans**: Premium features and enhanced functionality
- **Location Services**: Find nearby pet service providers

## 🏗️ Project Structure
=======
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
>>>>>>> origin/main

```
src/
├── navigation/          # Navigation configuration
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── TabNavigator.tsx
├── screens/            # Screen components
<<<<<<< HEAD
│   ├── auth/           # Authentication screens
│   ├── home/           # Home feed screens
│   ├── booking/        # Service booking screens
│   ├── create/         # Content creation screens
│   └── profile/        # User profile screens
├── components/         # Reusable UI components
│   ├── common/         # Generic components
│   ├── feed/           # Feed-specific components
│   └── booking/        # Booking-specific components
├── services/           # API and external services
│   ├── supabase.ts     # Supabase client configuration
│   ├── auth.ts         # Authentication service
│   ├── bookings.ts     # Booking management
│   ├── transformations.ts # Social feed content
│   └── storage.ts      # File upload/storage
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication state
│   ├── useBookings.ts  # Booking management
│   └── useTransformations.ts # Feed content
├── types/              # TypeScript type definitions
│   ├── index.ts        # Main type definitions
│   ├── database.ts     # Supabase database types
│   └── navigation.ts   # Navigation type definitions
├── constants/          # App constants and configuration
│   ├── theme.ts        # Design system and theme
│   └── config.ts       # App configuration
└── utils/              # Utility functions
    ├── validators.ts   # Form validation
    └── formatters.ts   # Data formatting
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio & Android Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pawspace
   ```

2. **Install dependencies**
=======
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
>>>>>>> origin/main
   ```bash
   npm install
   ```

<<<<<<< HEAD
3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your configuration values in `.env`:
   - Supabase URL and API key
   - Google Maps API key
   - Stripe publishable key
   - Other service API keys

4. **Start the development server**
=======
2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials and other configuration.

3. Start the development server:
>>>>>>> origin/main
   ```bash
   npm start
   ```

<<<<<<< HEAD
5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🛠️ Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Code Style

This project uses:
- **TypeScript** with strict mode enabled
- **ESLint** for code linting
- **Prettier** for code formatting (configured in ESLint)
- **Path aliases** for clean imports (`@/components`, `@/screens`, etc.)

### Key Technologies

- **React Native** - Mobile app framework
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **Supabase** - Backend-as-a-Service (database, auth, storage)
- **React Hook Form** - Form management (to be implemented)
- **React Query** - Server state management (to be implemented)

## 🎨 Design System

The app uses a comprehensive design system defined in `src/constants/theme.ts`:

- **Colors**: Primary (Indigo), Secondary (Pink), Status colors
- **Typography**: Font sizes, weights, and line heights
- **Spacing**: Consistent spacing scale
- **Shadows**: Elevation system
- **Border Radius**: Consistent corner radius scale

## 📱 Features Implementation Status

### ✅ Completed Structure
- [x] Project folder structure
- [x] TypeScript configuration with path aliases
- [x] Navigation setup (Stack, Tab, Auth navigators)
- [x] Screen components (basic structure)
- [x] Common UI components (Button, Input, Card, etc.)
- [x] Service layer (Supabase integration)
- [x] Custom hooks for state management
- [x] Type definitions
- [x] Theme and configuration
- [x] Utility functions (validators, formatters)
- [x] Barrel exports for clean imports

### 🚧 To Be Implemented
- [ ] Authentication flows (login, signup, onboarding)
- [ ] Social feed with transformations
- [ ] Service booking flow
- [ ] Image editing capabilities
- [ ] Real-time chat
- [ ] Push notifications
- [ ] Payment integration
- [ ] Location services
- [ ] Premium subscription features
- [ ] Unit and integration tests

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example`):

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# APIs
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key

# Feature Flags
EXPO_PUBLIC_ENABLE_PREMIUM_FEATURES=true
EXPO_PUBLIC_ENABLE_LIVE_CHAT=true
```

### App Configuration

Main app settings in `app.json`:
- Bundle identifiers for iOS/Android
- Permissions for camera, location, etc.
- Icon and splash screen configuration
- Expo plugins configuration

## 📚 Architecture Decisions

### State Management
- **Local State**: React hooks (`useState`, `useReducer`)
- **Server State**: Custom hooks with Supabase integration
- **Global State**: Context API for authentication

### Navigation
- **React Navigation v6** with TypeScript
- **Stack Navigator** for screen hierarchies
- **Tab Navigator** for main app sections
- **Type-safe navigation** with parameter definitions

### Data Layer
- **Supabase** for backend services
- **Custom service layer** for API abstraction
- **Custom hooks** for data fetching and state management
- **TypeScript** for type safety

### UI/UX
- **Component-based architecture** with reusable components
- **Design system** with consistent theming
- **Responsive design** for different screen sizes
- **Accessibility** considerations (to be implemented)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact: support@pawspace.com
- Documentation: [Coming Soon]

---

**PawSpace** - Connecting pet owners with amazing service providers! 🐕🐱✨
=======
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
>>>>>>> origin/main
