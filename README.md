# PawSpace - Pet Transformation App

A comprehensive React Native app for pet owners and service providers to connect, share transformations, and manage pet care services.

## Features Implemented

### Profile Management
- **ProfileScreen**: Complete profile layout for both Pet Owners and Providers
  - Cover photo and avatar management
  - User stats (transformations, following, followers)
  - Provider-specific stats (bookings, rating, revenue)
  - Tabbed interface (Transformations, Saved, Pets)
  - Business tools for providers

- **EditProfileScreen**: Comprehensive profile editing
  - Photo uploads (profile and cover)
  - Basic information (name, bio, location, phone)
  - Provider-specific fields (business info, hours, service areas)
  - Location picker integration

### Pets Management
- **MyPetsScreen**: Pet management interface
  - List of user's pets with photos and details
  - Add/Edit/Delete pet functionality
  - Pet information display (name, breed, age, special needs)

- **AddEditPetModal**: Pet creation and editing
  - Photo upload for pets
  - Complete pet information form
  - Species selection (dog, cat, other)
  - Special needs and notes

### Settings & Configuration
- **SettingsScreen**: Comprehensive settings management
  - Account settings (email, phone, password, subscription)
  - Notification preferences (push, email, booking reminders)
  - Privacy controls (profile visibility, location, messaging)
  - Support options (help center, contact, report issues)
  - App preferences (language, theme, data usage)
  - Danger zone (logout, delete account)

### Services & Integrations
- **NotificationService**: Expo push notifications
  - Device registration and token management
  - Notification sending and handling
  - Booking reminders and user interactions

- **AnalyticsService**: Firebase Analytics integration
  - Event tracking for key user actions
  - Screen view tracking
  - User property management

- **ErrorTrackingService**: Sentry error monitoring
  - Exception capture and reporting
  - User context and breadcrumbs
  - Error tracking helpers

## Technical Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Supabase** for backend services
- **Expo Notifications** for push notifications
- **Firebase Analytics** for user analytics
- **Sentry** for error tracking
- **React Navigation** for navigation
- **Expo Image Picker** for photo management
- **Expo Location** for location services

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase, Sentry, and Firebase credentials

3. **Supabase Setup**
   - Create a Supabase project
   - Set up the following tables:
     - `users` (with user profile data)
     - `pets` (pet information)
     - `transformations` (user posts)
     - `user_settings` (user preferences)
     - `saved_transformings` (bookmarked content)

4. **Run the App**
   ```bash
   npm start
   ```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  location TEXT,
  phone TEXT,
  profile_photo TEXT,
  cover_photo TEXT,
  user_type TEXT CHECK (user_type IN ('pet_owner', 'provider')),
  business_name TEXT,
  business_hours JSONB,
  service_areas TEXT[],
  specialties TEXT[],
  total_bookings INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  push_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Pets Table
```sql
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT CHECK (species IN ('dog', 'cat', 'other')),
  breed TEXT,
  age INTEGER,
  weight DECIMAL(5,2),
  special_needs TEXT,
  photo TEXT,
  vaccination_records TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Settings Table
```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  settings JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Key Features

### For Pet Owners
- Complete profile management with photo uploads
- Pet management (add, edit, delete pets)
- View and save transformation posts
- Comprehensive settings and privacy controls

### For Service Providers
- Business profile with service areas and specialties
- Business hours management
- Revenue and booking statistics
- Business tools integration

### Universal Features
- Push notifications for all user interactions
- Comprehensive analytics tracking
- Error monitoring and reporting
- Modern, responsive UI design
- Type-safe development with TypeScript

## Development Notes

- All screens are fully implemented with proper navigation
- Error handling is comprehensive throughout the app
- Analytics tracking is integrated for key user actions
- The app follows React Native best practices
- TypeScript interfaces ensure type safety
- Modular service architecture for easy maintenance

This implementation provides a complete foundation for a pet transformation app with all the requested features for profile management, settings, notifications, analytics, and error tracking.