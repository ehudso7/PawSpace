# PawSpace Authentication System

Complete Supabase authentication implementation for PawSpace mobile app.

## 🚀 Overview

This authentication system provides a complete user registration and login experience with:
- Multi-step signup process
- User type selection (Pet Owner / Service Provider)
- Email/password authentication
- Profile management
- Avatar uploads
- Onboarding flow
- AsyncStorage persistence

## 📁 Project Structure

```
src/
├── types/
│   └── index.ts              # TypeScript type definitions
├── utils/
│   └── validators.ts         # Form validation utilities
├── services/
│   ├── supabase.ts          # Supabase client configuration
│   └── auth.ts              # Authentication service functions
├── hooks/
│   └── useAuth.ts           # Custom auth hook
└── screens/
    └── auth/
        ├── OnboardingScreen.tsx  # First-time user onboarding
        ├── LoginScreen.tsx       # Login screen
        └── SignupScreen.tsx      # Multi-step signup
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

Or with yarn:
```bash
yarn install
```

### 2. Configure Supabase

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Database Setup

Create the following table in your Supabase database:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('pet_owner', 'service_provider')),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Create storage policies
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 📱 Features

### Authentication Screens

#### Onboarding Screen
- First-time user experience
- 3 swipeable slides explaining app features
- Skip functionality
- Stored in AsyncStorage to show only once

#### Login Screen
- Email and password inputs with validation
- Show/hide password toggle
- "Forgot Password" link
- "Sign Up" navigation
- Error handling with user-friendly messages
- Auto-navigation on successful login

#### Signup Screen
**Step 1: User Type Selection**
- Choose between Pet Owner or Service Provider
- Visual card-based selection

**Step 2: Credentials**
- Email input with validation
- Password with strength requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- Confirm password with matching validation

**Step 3: Profile Information**
- Full name (required)
- Phone number (optional)
- Location (optional)

**Step 4: Review & Terms**
- Account summary display
- Terms of service acceptance
- Account creation

### Auth Hook (`useAuth`)

The `useAuth` hook provides:

```typescript
const {
  user,           // Current user object or null
  loading,        // Loading state
  error,          // Error message string
  signIn,         // Sign in function
  signUp,         // Sign up function
  signOut,        // Sign out function
  clearError,     // Clear error message
  refreshUser,    // Refresh user data
} = useAuth();
```

### Auth Service Functions

```typescript
// Sign up new user
signUp(email, password, userType, profileData)

// Sign in existing user
signIn(email, password)

// Sign out current user
signOut()

// Get current user
getCurrentUser()

// Update user profile
updateProfile(userId, userData)

// Upload avatar image
uploadAvatar(userId, imageUri)

// Send password reset email
sendPasswordResetEmail(email)
```

### Validation Utilities

```typescript
// Email validation
validateEmail(email: string): boolean

// Password validation with requirements
validatePassword(password: string): ValidationResult

// Phone number validation
validatePhone(phone: string): boolean

// Full name validation
validateFullName(name: string): boolean

// Password matching
passwordsMatch(password: string, confirmPassword: string): boolean
```

## 🎨 UI Components

All screens use **React Native Paper** components for consistent Material Design:
- TextInput with icons
- Buttons (contained, text)
- Cards
- ProgressBar
- Checkbox
- HelperText
- IconButton

## 🔐 Security Features

- Passwords hashed by Supabase Auth
- Row Level Security (RLS) enabled on profiles table
- Storage bucket policies for avatar uploads
- Input validation on both client and server
- AsyncStorage for secure session persistence

## 🚦 Navigation Flow

```
First Launch:
  OnboardingScreen → SignupScreen → [Auto-login] → Home

Returning User (Logged Out):
  LoginScreen → [Success] → Home

Signup Flow:
  Step 1 (User Type) → Step 2 (Credentials) → 
  Step 3 (Profile) → Step 4 (Terms) → [Success] → Home
```

## 📝 Type Definitions

### User
```typescript
interface User {
  id: string;
  email: string;
  user_type: 'pet_owner' | 'service_provider';
  profile: UserProfile;
}
```

### UserProfile
```typescript
interface UserProfile {
  full_name: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
}
```

## 🧪 Testing Checklist

- [ ] User can complete onboarding
- [ ] User can sign up as Pet Owner
- [ ] User can sign up as Service Provider
- [ ] Email validation works correctly
- [ ] Password strength validation works
- [ ] Password matching validation works
- [ ] User can log in with valid credentials
- [ ] User sees error with invalid credentials
- [ ] User session persists after app restart
- [ ] User can log out
- [ ] Profile data is stored correctly
- [ ] Avatar upload works (when implemented)

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env` file exists with correct keys
- Restart the development server after adding environment variables

### "Failed to create user profile"
- Check database policies are set correctly
- Verify profiles table exists
- Check Supabase logs for detailed error

### "Network error"
- Verify Supabase URL is correct
- Check internet connection
- Verify Supabase project is active

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Native Paper](https://reactnativepaper.com/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Documentation](https://docs.expo.dev/)

## 🔄 Future Enhancements

- Social auth (Google, Apple)
- Two-factor authentication
- Email verification
- Phone number verification
- Password reset flow
- Profile picture cropping
- Biometric authentication

## 📄 License

MIT
