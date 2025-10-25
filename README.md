# PawSpace - Pet Services App

A React Native app built with Expo that connects pet owners with trusted service providers.

## Features

- **Complete Authentication System** with Supabase
- **Multi-step Registration** with user type selection
- **Profile Management** with avatar upload
- **Onboarding Experience** for new users
- **Form Validation** and error handling
- **Responsive Design** with React Native Paper

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Fill in your Supabase credentials in `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

Run the SQL commands in `supabase-setup.sql` in your Supabase SQL editor to create:
- `profiles` table with RLS policies
- `avatars` storage bucket with policies
- Necessary triggers and functions

### 4. Run the App

```bash
npm start
```

## Project Structure

```
src/
├── hooks/
│   └── useAuth.ts          # Custom auth hook
├── screens/
│   └── auth/
│       ├── LoginScreen.tsx      # Login screen
│       ├── SignupScreen.tsx     # Multi-step signup
│       └── OnboardingScreen.tsx # Onboarding slides
├── services/
│   ├── supabase.ts         # Supabase client config
│   └── auth.ts             # Authentication service
├── types/
│   └── index.ts            # TypeScript type definitions
└── utils/
    └── validators.ts       # Form validation utilities
```

## Authentication Features

### Login Screen
- Email/password validation
- Loading states
- Error handling
- Forgot password functionality
- Navigation to signup

### Signup Screen
- **Step 1**: User type selection (Pet Owner / Service Provider)
- **Step 2**: Email and password creation
- **Step 3**: Profile information (name, location, phone)
- **Step 4**: Profile picture upload (optional)
- Progress indicator
- Form validation at each step
- Terms of service agreement

### Onboarding Screen
- 3 swipeable cards explaining app features
- Skip functionality
- Only shown on first launch
- Smooth animations and transitions

## Authentication Service

The `AuthService` class provides:
- `signUp()` - Create new user account with profile
- `signIn()` - Authenticate existing user
- `signOut()` - Sign out current user
- `getCurrentUser()` - Get current authenticated user
- `updateProfile()` - Update user profile information
- `uploadAvatar()` - Upload and set profile picture
- `resetPassword()` - Send password reset email

## Custom Auth Hook

The `useAuth` hook provides:
- Real-time auth state management
- Loading states
- Error handling with auto-clear
- Easy-to-use authentication methods
- Automatic session persistence

## Form Validation

Comprehensive validation utilities:
- Email format validation
- Strong password requirements
- Phone number validation
- Required field validation
- Confirmation password matching

## UI Components

Built with React Native Paper for:
- Consistent Material Design
- Accessible components
- Theme support
- Loading indicators
- Error messages

## Environment Variables

Required environment variables:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

## Database Schema

### Profiles Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `full_name` (Text, Required)
- `avatar_url` (Text, Optional)
- `phone` (Text, Optional)
- `location` (Text, Optional)
- `bio` (Text, Optional)
- `user_type` (Enum: 'pet_owner' | 'service_provider')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Storage
- `avatars` bucket for profile pictures
- Public read access
- User-specific upload permissions

## Security

- Row Level Security (RLS) enabled
- Users can only access their own data
- Secure file upload with user validation
- Password reset via email
- Session management with AsyncStorage

## Next Steps

This authentication system provides a solid foundation. You can extend it by:
- Adding social login (Google, Apple)
- Implementing email verification
- Adding two-factor authentication
- Creating role-based permissions
- Building the main app features

## License

MIT License