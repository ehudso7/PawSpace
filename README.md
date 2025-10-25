# PawSpace - Complete Supabase Authentication

A comprehensive React Native authentication system built with Supabase, featuring multi-step signup, onboarding, and user management.

## Features

### 🔐 Authentication
- **Sign Up**: Multi-step registration with user type selection (Pet Owner/Service Provider)
- **Sign In**: Email/password authentication with validation
- **Sign Out**: Secure logout with session cleanup
- **Password Reset**: Email-based password recovery
- **Profile Management**: Update user information and avatar upload

### 📱 User Experience
- **Onboarding**: Swipeable introduction cards for first-time users
- **Form Validation**: Real-time validation with user-friendly error messages
- **Loading States**: Visual feedback during async operations
- **Error Handling**: Comprehensive error management with snackbar notifications

### 🎨 UI Components
- **React Native Paper**: Material Design components
- **Responsive Design**: Optimized for various screen sizes
- **Accessibility**: Screen reader friendly with proper labels
- **Custom Styling**: Consistent theme and branding

## Project Structure

```
src/
├── hooks/
│   └── useAuth.ts              # Authentication state management
├── screens/
│   └── auth/
│       ├── LoginScreen.tsx     # Login form with validation
│       ├── SignupScreen.tsx    # Multi-step registration
│       └── OnboardingScreen.tsx # First-time user introduction
├── services/
│   ├── supabase.ts            # Supabase client configuration
│   └── auth.ts                # Authentication service functions
├── types/
│   ├── index.ts               # TypeScript interfaces
│   └── database.ts            # Supabase database types
├── utils/
│   └── validators.ts          # Form validation utilities
└── App.tsx                    # Main application component
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

Run the SQL commands from `src/types/database.sql` in your Supabase SQL editor to create the required tables and policies.

### 4. Storage Setup

The database schema includes a storage bucket for user avatars. Make sure to configure storage policies in your Supabase dashboard.

### 5. Run the Application

```bash
# For iOS
npx react-native run-ios

# For Android
npx react-native run-android
```

## Usage

### Authentication Hook

```typescript
import { useAuth } from './hooks/useAuth';

const MyComponent = () => {
  const { user, loading, signIn, signUp, signOut } = useAuth();

  const handleLogin = async () => {
    const { success, error } = await signIn({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (success) {
      // Navigate to home screen
    } else {
      // Show error message
    }
  };

  return (
    // Your component JSX
  );
};
```

### Form Validation

```typescript
import { validateEmail, validatePassword } from './utils/validators';

const email = 'user@example.com';
const password = 'SecurePass123!';

const isEmailValid = validateEmail(email);
const passwordValidation = validatePassword(password);

if (!passwordValidation.valid) {
  console.log('Password errors:', passwordValidation.errors);
}
```

## Key Components

### LoginScreen
- Email/password input with validation
- "Forgot password" functionality
- Navigation to signup screen
- Loading states and error handling

### SignupScreen
- **Step 1**: User type selection (Pet Owner/Service Provider)
- **Step 2**: Email and password creation
- **Step 3**: Profile information (name, location, phone, bio)
- **Step 4**: Profile picture upload (optional)
- Progress indicator and step navigation

### OnboardingScreen
- Swipeable introduction cards
- Skip functionality
- AsyncStorage integration for completion tracking
- Smooth animations and transitions

## TypeScript Support

The project includes comprehensive TypeScript definitions:

```typescript
interface User {
  id: string;
  email: string;
  user_type: 'pet_owner' | 'service_provider';
  profile: UserProfile;
}

interface UserProfile {
  full_name: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
}
```

## Security Features

- **Row Level Security (RLS)**: Database policies ensure users can only access their own data
- **Input Validation**: Client and server-side validation
- **Secure Storage**: AsyncStorage for session persistence
- **Error Handling**: No sensitive information exposed in error messages

## Customization

### Theme
Update the theme object in `App.tsx` to customize colors and styling:

```typescript
const theme = {
  colors: {
    primary: '#2E7D32',
    accent: '#4CAF50',
    // ... other colors
  },
};
```

### Validation Rules
Modify validation functions in `src/utils/validators.ts` to adjust password requirements, email formats, etc.

## Dependencies

- **@supabase/supabase-js**: Supabase client library
- **@react-native-async-storage/async-storage**: Local storage
- **react-native-paper**: UI components
- **react-native-image-picker**: Image selection
- **react-native-pager-view**: Swipeable onboarding
- **react-native-gesture-handler**: Touch handling
- **react-native-reanimated**: Animations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details