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

```
src/
├── navigation/          # Navigation configuration
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── TabNavigator.tsx
├── screens/            # Screen components
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
   ```bash
   npm install
   ```

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
   ```bash
   npm start
   ```

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