# Pet Transformation App

A comprehensive React Native/Expo app for pet transformation services with complete profile management, settings, notifications, analytics, and error tracking.

## Features

### Profile Management
- **ProfileScreen**: Different layouts for Pet Owners and Providers
  - Cover photo and avatar (editable)
  - Name, location, bio
  - Stats row (transformations, following, followers)
  - Provider-specific sections (services, bookings, ratings, revenue)
  - Tabs for transformations, saved posts, and pets

- **EditProfileScreen**: Complete profile editing
  - Profile and cover photo upload
  - Full name, bio (500 chars), location with map picker
  - Phone number, email (verified via auth)
  - Provider-specific fields (business name, hours, service areas, specialties)

### Pet Management
- **MyPetsScreen**: List and manage pets
  - Add pet button
  - Pet cards with name, breed, age, photo
  - Edit/delete options

- **AddEditPetScreen**: Add or edit pet details
  - Pet photo upload
  - Name, species (dog/cat/other), breed selection
  - Age, weight, special needs/notes
  - Vaccination records (file upload)

### Settings
- **Account**: Email, phone, password, subscription status
- **Notifications**: Push/email toggles, booking reminders, followers, comments/likes, promotional emails
- **Privacy**: Profile visibility, location sharing, messaging permissions, blocked users
- **Support**: Help center, contact support, report problems, terms, privacy policy
- **App**: Language, theme (light/dark/auto), data usage, cache management, version
- **Danger Zone**: Logout, delete account

### Services
- **NotificationService**: Expo push notifications with registration, sending, and handling
- **AnalyticsService**: Firebase Analytics with event tracking
- **ErrorTrackingService**: Sentry integration for error monitoring
- **SupabaseService**: Database and authentication integration

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Supabase** for backend and authentication
- **Expo Notifications** for push notifications
- **Firebase Analytics** for analytics
- **Sentry** for error tracking
- **React Native Paper** for UI components
- **Expo Image Picker** for photo selection
- **Expo Location** for location services
- **React Native Document Picker** for file uploads

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### 3. Supabase Setup
1. Create a new Supabase project
2. Set up the following tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  location TEXT,
  phone TEXT,
  avatar_url TEXT,
  cover_photo_url TEXT,
  user_type TEXT CHECK (user_type IN ('pet_owner', 'provider')),
  push_token TEXT,
  business_name TEXT,
  business_hours JSONB,
  service_areas TEXT[],
  specialties TEXT[],
  total_bookings INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  revenue DECIMAL(10,2),
  notification_preferences JSONB,
  privacy_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pets table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT CHECK (species IN ('dog', 'cat', 'other')),
  breed TEXT NOT NULL,
  age INTEGER NOT NULL,
  weight DECIMAL(5,2),
  special_needs TEXT,
  photo_url TEXT,
  vaccination_records TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transformations table
CREATE TABLE transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  before_photos TEXT[],
  after_photos TEXT[],
  service_type TEXT NOT NULL,
  provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved transformations table
CREATE TABLE saved_transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transformation_id UUID REFERENCES transformations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, transformation_id)
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Set up storage buckets:
   - `profile-images` for profile and cover photos
   - `pet-images` for pet photos
   - `pet-documents` for vaccination records

### 4. Firebase Setup
1. Create a Firebase project
2. Enable Analytics
3. Add your app to the project
4. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
5. Place them in the appropriate directories

### 5. Sentry Setup
1. Create a Sentry project
2. Get your DSN from the project settings
3. Update the DSN in your environment variables

### 6. Run the App
```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── navigation/          # Navigation configuration
├── screens/            # Screen components
│   ├── profile/        # Profile-related screens
│   ├── settings/       # Settings screen
│   └── pets/          # Pet management screens
├── services/           # External services
│   ├── analytics.ts    # Firebase Analytics
│   ├── errorTracking.ts # Sentry error tracking
│   ├── notifications.ts # Push notifications
│   └── supabase.ts     # Supabase client
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Key Features Implementation

### Profile Management
- Dynamic layouts for different user types (pet owners vs providers)
- Image upload with Supabase storage integration
- Location services with reverse geocoding
- Business hours management for providers
- Service areas and specialties management

### Pet Management
- Complete CRUD operations for pets
- Image upload and document management
- Breed selection with predefined options
- Vaccination records with file upload
- Special needs tracking

### Settings & Privacy
- Comprehensive settings management
- AsyncStorage for local settings persistence
- Supabase integration for user preferences
- Privacy controls and blocked users management
- Theme and language preferences

### Notifications
- Expo push notification setup
- Token registration and management
- Notification handling and navigation
- Booking reminders and scheduling
- User preference-based notification filtering

### Analytics & Error Tracking
- Firebase Analytics integration
- Custom event tracking
- User property management
- Sentry error tracking and monitoring
- Performance monitoring

## Development Notes

- All screens are fully typed with TypeScript
- Error handling is implemented throughout
- Analytics events are tracked for key user actions
- Images are optimized and stored in Supabase storage
- Settings are persisted both locally and remotely
- Navigation is properly typed and structured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
