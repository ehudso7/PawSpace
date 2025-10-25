# PawSpace - Pet Transformation Social App

A comprehensive React Native app for pet owners and grooming service providers to share pet transformations, connect with each other, and book grooming services.

## Features

### Profile Management
- **User Profiles**: Complete profile system with avatar, cover photo, bio, and location
- **Provider Profiles**: Enhanced profiles for service providers with business information, specialties, and ratings
- **Edit Profile**: Comprehensive profile editing with image uploads and location picker
- **Stats Tracking**: Follower counts, transformation counts, and provider-specific metrics

### Pet Management
- **My Pets**: Manage multiple pets with detailed information
- **Pet Profiles**: Name, species, breed, age, weight, photos, and special needs
- **Vaccination Records**: Upload and manage vaccination documents
- **Breed Database**: Comprehensive breed selection for dogs and cats

### Social Features
- **Transformations Feed**: Before/after photo sharing with likes and comments
- **Follow System**: Follow other users and see their transformations
- **Saved Posts**: Bookmark favorite transformations
- **Profile Tabs**: Organized view of transformations, saved posts, and pets

### Settings & Privacy
- **Comprehensive Settings**: Account, notifications, privacy, and app preferences
- **Notification Controls**: Granular control over push and email notifications
- **Privacy Settings**: Profile visibility, location sharing, and message permissions
- **Theme Support**: Light, dark, and auto theme options

### Technical Features
- **Push Notifications**: Expo-based notification system with proper permissions
- **Analytics**: Firebase Analytics integration for user behavior tracking
- **Error Tracking**: Sentry integration for comprehensive error monitoring
- **Image Management**: Supabase storage for profile and pet images
- **Real-time Updates**: Live updates for likes, comments, and follows

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Navigation**: React Navigation v6
- **State Management**: React Hooks + Context
- **Forms**: Formik + Yup validation
- **Analytics**: Firebase Analytics
- **Error Tracking**: Sentry
- **Notifications**: Expo Notifications
- **Image Handling**: Expo Image Picker
- **Maps**: React Native Maps
- **UI Components**: React Native Elements + Custom components

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Studio
- Supabase account
- Firebase project (for analytics)
- Sentry account (for error tracking)

### Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd pawspace
   npm install
   ```

2. **Environment Configuration**
   Create `.env` file in the root directory:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_PROJECT_ID=your_firebase_project_id
   SENTRY_DSN=your_sentry_dsn
   ```

3. **Supabase Setup**
   - Create a new Supabase project
   - Run the migration file: `supabase/migrations/001_initial_schema.sql`
   - Set up storage buckets: `profiles`, `pets`, `transformations`
   - Configure RLS policies (included in migration)

4. **Firebase Setup**
   - Create a Firebase project
   - Enable Analytics
   - Add your app configuration to `firebase.json`

5. **Sentry Setup**
   - Create a Sentry project
   - Update DSN in `src/services/errorTracking.ts`

### Development

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   └── LoadingSpinner.tsx
├── hooks/              # Custom React hooks
│   └── useAuth.ts
├── screens/            # Screen components
│   ├── profile/        # Profile-related screens
│   │   ├── ProfileScreen.tsx
│   │   └── EditProfileScreen.tsx
│   ├── pets/          # Pet management screens
│   │   ├── MyPetsScreen.tsx
│   │   └── AddEditPetModal.tsx
│   └── settings/      # Settings screens
│       └── SettingsScreen.tsx
├── services/          # External service integrations
│   ├── supabase.ts    # Database client and types
│   ├── notifications.ts # Push notification service
│   ├── analytics.ts   # Analytics tracking
│   └── errorTracking.ts # Error monitoring
└── utils/             # Utility functions
    ├── formatters.ts  # Data formatting utilities
    └── imageUtils.ts  # Image handling utilities
```

## Database Schema

The app uses a comprehensive PostgreSQL schema with the following main tables:

- **users**: Extended user profiles with provider information
- **user_settings**: Granular user preferences and privacy settings
- **pets**: Pet information and medical records
- **transformations**: Before/after photos with engagement metrics
- **follows**: Social following relationships
- **saved_transformations**: Bookmarked posts
- **likes**: Post engagement tracking
- **comments**: User interactions on posts
- **notifications**: In-app notification system

## Key Features Implementation

### Profile System
- Tab-based profile layout with transformations, saved posts, and pets
- Provider-specific features including business information and ratings
- Comprehensive edit functionality with image uploads
- Real-time stats updates

### Pet Management
- Full CRUD operations for pet profiles
- Image upload for pet photos
- Document upload for vaccination records
- Breed selection with comprehensive databases

### Settings Architecture
- Modular settings system with categories
- Real-time preference updates
- Privacy controls with immediate effect
- Theme switching with system preference detection

### Notification System
- Permission-based push notification setup
- Granular notification preferences
- Deep linking for notification actions
- Badge count management

### Analytics Integration
- User behavior tracking
- Screen view analytics
- Event-based tracking for key actions
- Custom user properties

### Error Handling
- Comprehensive error boundary implementation
- Automatic error reporting to Sentry
- User-friendly error messages
- Development vs production error handling

## Security Features

- Row Level Security (RLS) policies for all tables
- Secure file upload with user-specific storage paths
- Privacy controls for profile visibility
- Blocked user management
- Secure authentication with Supabase Auth

## Performance Optimizations

- Image compression and optimization
- Lazy loading for large lists
- Efficient database queries with proper indexing
- Caching strategies for frequently accessed data
- Optimized bundle size with selective imports

## Deployment

### Expo Build
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

### Environment-Specific Builds
- Development: Local Expo server
- Staging: Expo preview builds
- Production: App store builds with production services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper error handling
4. Add analytics tracking for new features
5. Test thoroughly on both platforms
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

Built with ❤️ for pet lovers everywhere 🐾