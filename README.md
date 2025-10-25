# PawSpace

A comprehensive mobile application for connecting pet owners with trusted pet care service providers.

## 🎯 Features

- **Complete Authentication System**
  - Multi-step signup with user type selection
  - Secure login with email/password
  - First-time user onboarding
  - Profile management
  - Avatar uploads
  - Session persistence

- **User Types**
  - Pet Owners: Find and book pet care services
  - Service Providers: Offer and manage pet care services

## 📦 Installation

```bash
# Install dependencies
npm install

# or with yarn
yarn install
```

## ⚙️ Configuration

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

2. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Set up Database**
   - See `AUTHENTICATION.md` for complete SQL setup instructions
   - Create the `profiles` table
   - Set up Row Level Security policies
   - Create storage bucket for avatars

## 🚀 Running the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📚 Documentation

- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Complete authentication system documentation
- **[App.example.tsx](./App.example.tsx)** - Example navigation setup
- **[useAuth.examples.tsx](./useAuth.examples.tsx)** - Hook usage examples

## 🏗️ Project Structure

```
src/
├── types/
│   └── index.ts              # TypeScript definitions
├── utils/
│   └── validators.ts         # Form validation utilities
├── services/
│   ├── supabase.ts          # Supabase client
│   └── auth.ts              # Auth service
├── hooks/
│   └── useAuth.ts           # Auth state hook
└── screens/
    └── auth/
        ├── OnboardingScreen.tsx
        ├── LoginScreen.tsx
        └── SignupScreen.tsx
```

## 🔐 Authentication Flow

1. **First Launch**: Onboarding → Signup → Home
2. **Existing User**: Login → Home
3. **Signup Process**:
   - Step 1: Choose user type (Pet Owner / Service Provider)
   - Step 2: Enter email and password
   - Step 3: Provide profile information
   - Step 4: Accept terms and complete signup

## 🛠️ Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Supabase** - Backend and authentication
- **React Native Paper** - UI components
- **AsyncStorage** - Local storage

## 📱 Screens

### Onboarding Screen
- 3 swipeable slides explaining app features
- Skip or navigate through slides
- Only shown on first launch

### Login Screen
- Email/password authentication
- Input validation
- Error handling
- "Forgot Password" link
- Navigation to signup

### Signup Screen
- Multi-step registration form
- Progress indicator
- User type selection
- Profile information collection
- Terms acceptance
- Comprehensive validation

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linter
npm run lint
```

## 🔧 Development

### Using the Auth Hook

```typescript
import { useAuth } from './src/hooks/useAuth';

function MyComponent() {
  const { user, loading, error, signIn, signOut } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen />;
  
  return <HomeScreen user={user} onSignOut={signOut} />;
}
```

See `useAuth.examples.tsx` for more examples.

## 🚧 Roadmap

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Social authentication (Google, Apple)
- [ ] Two-factor authentication
- [ ] Profile picture editing with crop
- [ ] Biometric authentication
- [ ] Pet profiles management
- [ ] Service provider listings
- [ ] Booking system
- [ ] Reviews and ratings
- [ ] In-app messaging
- [ ] Push notifications

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before getting started.

## 📄 License

MIT

## 🆘 Support

For issues and questions:
- Check the documentation in `AUTHENTICATION.md`
- Review example files
- Open an issue on GitHub

## 👥 Authors

PawSpace Development Team