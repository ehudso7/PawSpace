# PawSpace Authentication - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Environment Setup (2 minutes)

1. Create `.env` file:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

2. Install dependencies:
```bash
npm install
```

### Step 2: Supabase Database Setup (3 minutes)

Run this SQL in your Supabase SQL Editor:

```sql
-- 1. Create profiles table
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

-- 2. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- 5. Storage policies
CREATE POLICY "Public avatar access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "User upload avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
```

### Step 3: Start Development

```bash
npm start
```

## 📱 Using in Your App

### Basic Setup (App.tsx)

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from './src/hooks/useAuth';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignupScreen } from './src/screens/auth/SignupScreen';

function App() {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  
  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
```

### Using Auth in Components

```typescript
import { useAuth } from './src/hooks/useAuth';

function MyScreen() {
  const { user, signOut } = useAuth();
  
  return (
    <View>
      <Text>Welcome, {user?.profile.full_name}!</Text>
      <Button onPress={signOut}>Sign Out</Button>
    </View>
  );
}
```

## 🔑 Key Features

### Sign Up
```typescript
const { signUp } = useAuth();

await signUp(
  'user@example.com',
  'Password123',
  'pet_owner',
  {
    full_name: 'John Doe',
    phone: '1234567890',
    location: 'New York'
  }
);
```

### Sign In
```typescript
const { signIn } = useAuth();

const success = await signIn('user@example.com', 'Password123');
if (success) {
  // Navigate to home
}
```

### Sign Out
```typescript
const { signOut } = useAuth();

await signOut();
```

### Access User Data
```typescript
const { user } = useAuth();

console.log(user?.profile.full_name);
console.log(user?.user_type); // 'pet_owner' or 'service_provider'
console.log(user?.profile.phone);
```

## 🎨 Screen Navigation

### Auth Stack (Unauthenticated)
1. `OnboardingScreen` - First time only
2. `LoginScreen` - Returning users
3. `SignupScreen` - New users

### App Stack (Authenticated)
Your app screens go here after user logs in.

## 🔒 Security Checklist

- [✓] Passwords hashed by Supabase
- [✓] Row Level Security enabled
- [✓] Input validation
- [✓] Session persistence
- [✓] Storage bucket policies

## ⚡ Common Tasks

### Check if user is logged in
```typescript
const { user } = useAuth();
if (user) {
  // User is authenticated
}
```

### Show loading state
```typescript
const { loading } = useAuth();
if (loading) return <ActivityIndicator />;
```

### Handle errors
```typescript
const { error, clearError } = useAuth();

{error && <Text style={styles.error}>{error}</Text>}

// Clear error when user types
onChangeText={(text) => {
  setValue(text);
  clearError();
}}
```

### Update profile
```typescript
import { updateProfile } from './src/services/auth';

await updateProfile(user.id, {
  full_name: 'New Name',
  phone: '9876543210',
  location: 'Los Angeles'
});

// Refresh user data
refreshUser();
```

### Upload avatar
```typescript
import { uploadAvatar } from './src/services/auth';

const result = await uploadAvatar(user.id, imageUri);
if (result.url) {
  console.log('Avatar uploaded:', result.url);
}
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing Supabase env variables" | Check `.env` file and restart server |
| "Failed to create profile" | Verify database policies are set |
| Login not working | Clear app cache and AsyncStorage |
| Session not persisting | Check AsyncStorage permissions |

## 📞 Need Help?

1. Check `AUTHENTICATION.md` for detailed docs
2. See `useAuth.examples.tsx` for code examples
3. Review `App.example.tsx` for navigation setup

## 🎓 Next Steps

1. ✅ Complete setup above
2. ✅ Test signup flow
3. ✅ Test login flow
4. ⬜ Customize UI/styling
5. ⬜ Add your app screens
6. ⬜ Implement password reset
7. ⬜ Add email verification

## 💡 Pro Tips

- Use `clearError()` when user starts typing
- Show loading state during auth operations
- Validate inputs before submitting
- Handle errors gracefully with user-friendly messages
- Use the `refreshUser()` function after profile updates
- Store onboarding status in AsyncStorage
- Implement proper navigation guards

---

**Ready to build?** Run `npm start` and you're all set! 🚀
