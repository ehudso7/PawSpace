# PawSpace Navigation System Documentation

## Overview

The PawSpace navigation system implements a complete authentication flow with nested navigation using React Navigation v6. The system consists of three main navigators:

1. **AppNavigator** - Root navigator that manages authentication state
2. **AuthNavigator** - Stack navigator for authentication flows
3. **TabNavigator** - Bottom tab navigator with nested stacks for main app

## Architecture Diagram

```
AppNavigator (Root)
├── AuthNavigator (if not authenticated)
│   ├── Login Screen
│   ├── Signup Screen
│   └── Onboarding Screen
│
└── TabNavigator (if authenticated)
    ├── Home Tab Stack
    │   ├── Feed Screen
    │   ├── Post Detail Screen
    │   └── User Profile Screen
    │
    ├── Book Tab Stack
    │   ├── Service List Screen
    │   ├── Service Detail Screen
    │   ├── Booking Screen
    │   └── Booking Confirmation Screen
    │
    ├── Create Tab Stack
    │   ├── Image Selector Screen
    │   └── Post Composer Screen
    │
    └── Profile Tab Stack
        ├── Profile Main Screen
        ├── Edit Profile Screen
        ├── Settings Screen
        ├── My Bookings Screen
        └── My Pets Screen
```

## Navigation Types

### Type System

All navigation is fully typed using TypeScript. The type system includes:

```typescript
// Root navigation types
type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
};

// Auth stack types
type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
};

// Tab types with nested stacks
type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  BookTab: NavigatorScreenParams<BookStackParamList>;
  CreateTab: NavigatorScreenParams<CreateStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};
```

### Using Types in Screens

```typescript
import type { HomeScreenProps } from '../types/navigation';

type Props = HomeScreenProps<'Feed'>;

const FeedScreen: React.FC<Props> = ({ navigation, route }) => {
  // Type-safe navigation
  navigation.navigate('PostDetail', { postId: '123' });
  
  return <View>...</View>;
};
```

## Authentication Flow

### How It Works

1. **App Launch**: AppNavigator checks Supabase session
2. **Loading State**: Shows ActivityIndicator while checking
3. **Route Selection**: 
   - No session → Show AuthNavigator
   - Has session → Show TabNavigator
4. **Auth Listener**: Listens for auth state changes
5. **Automatic Navigation**: Switches between Auth/Main automatically

### Implementation Details

```typescript
// In AppNavigator.tsx
useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setIsLoading(false);
  };

  checkSession();

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setIsAuthenticated(!!session);
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

## Screen Components

### Auth Screens

#### LoginScreen
- Email/password login form
- Validation and error handling
- Navigation to Signup
- Supabase authentication

#### SignupScreen
- User registration form
- Password confirmation
- Email validation
- Navigates to Onboarding on success

#### OnboardingScreen
- Welcome screen for new users
- Feature highlights
- Terms acceptance
- Notification preferences

### Tab Screens

#### Home Tab
- **FeedScreen**: Main feed with posts
- **PostDetailScreen**: Detailed post view
- **UserProfileScreen**: View other user profiles

#### Book Tab
- **ServiceListScreen**: Browse pet services
- **ServiceDetailScreen**: Service information
- **BookingScreen**: Book a service
- **BookingConfirmationScreen**: Booking success

#### Create Tab
- **ImageSelectorScreen**: Select photo
- **PostComposerScreen**: Compose post with caption

#### Profile Tab
- **ProfileScreen**: User's own profile
- **EditProfileScreen**: Edit profile info
- **SettingsScreen**: App settings
- **MyBookingsScreen**: View bookings
- **MyPetsScreen**: Manage pets

## Navigation Patterns

### Basic Navigation

```typescript
// Navigate to a screen
navigation.navigate('PostDetail', { postId: '123' });

// Go back
navigation.goBack();

// Replace current screen
navigation.replace('Login');

// Reset navigation stack
navigation.reset({
  index: 0,
  routes: [{ name: 'Feed' }],
});
```

### Tab Navigation

```typescript
// Navigate to a specific tab
navigation.navigate('HomeTab');

// Navigate to a screen in another tab
navigation.navigate('BookTab', { 
  screen: 'ServiceDetail', 
  params: { serviceId: '123' } 
});
```

### Cross-Stack Navigation

```typescript
// From any screen, navigate to another tab's screen
navigation.navigate('ProfileTab', { 
  screen: 'MyBookings' 
});
```

## Deep Linking

### URL Patterns

The app supports deep linking with these patterns:

```
pawspace://login                    → Login Screen
pawspace://signup                   → Signup Screen
pawspace://feed                     → Feed Screen
pawspace://post/:postId             → Post Detail
pawspace://user/:userId             → User Profile
pawspace://services                 → Service List
pawspace://service/:serviceId       → Service Detail
pawspace://book/:serviceId          → Booking
pawspace://booking/:bookingId       → Booking Confirmation
pawspace://create                   → Image Selector
pawspace://profile                  → Profile
pawspace://profile/edit             → Edit Profile
pawspace://settings                 → Settings
pawspace://bookings                 → My Bookings
pawspace://pets                     → My Pets
```

### Web URLs

Also supports HTTPS URLs:
```
https://pawspace.app/post/123
https://pawspace.app/services
https://pawspace.app/profile
```

### Testing Deep Links

```bash
# iOS Simulator
xcrun simctl openurl booted pawspace://post/123

# Android Emulator
adb shell am start -W -a android.intent.action.VIEW -d "pawspace://post/123"

# Web
http://localhost:19006/post/123
```

## Styling

### Tab Bar Styling

```typescript
tabBarStyle: {
  backgroundColor: '#FFFFFF',
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: '#E5E5EA',
  paddingBottom: Platform.OS === 'ios' ? 20 : 5,
  paddingTop: 5,
  height: Platform.OS === 'ios' ? 85 : 60,
  elevation: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
}
```

### Header Styling

```typescript
headerStyle: {
  backgroundColor: theme.colors.primary,
},
headerTintColor: '#fff',
headerTitleStyle: {
  fontWeight: 'bold',
}
```

### Custom Tab Icons

Uses Material Community Icons:
- Home: `home` / `home-outline`
- Book: `calendar` / `calendar-outline`
- Create: `plus-circle` / `plus-circle-outline`
- Profile: `account` / `account-outline`

## Performance Optimization

### Lazy Loading

Screens are lazy-loaded by default with React Navigation.

### Memoization

Use `React.memo` for complex screens:

```typescript
const FeedScreen = React.memo<Props>(({ navigation }) => {
  // Component code
});
```

### Navigation State

Avoid unnecessary navigation state updates:

```typescript
// Good: Single navigation call
navigation.navigate('PostDetail', { postId: '123' });

// Bad: Multiple state updates
navigation.navigate('HomeTab');
navigation.navigate('PostDetail', { postId: '123' });
```

## Error Handling

### Auth Errors

```typescript
try {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
} catch (err: any) {
  setError(err.message || 'Failed to login');
}
```

### Navigation Errors

```typescript
// Use optional chaining for safety
navigation?.navigate('Screen');

// Check if screen exists
if (navigation.canGoBack()) {
  navigation.goBack();
}
```

## Best Practices

### 1. Type Safety
Always use TypeScript types for navigation props:
```typescript
type Props = HomeScreenProps<'Feed'>;
```

### 2. Screen Options
Define screen options for consistent styling:
```typescript
<Stack.Screen 
  name="Feed" 
  component={FeedScreen}
  options={{
    title: 'PawSpace',
    headerLargeTitle: Platform.OS === 'ios',
  }}
/>
```

### 3. Navigation Params
Keep params simple and serializable:
```typescript
// Good
navigation.navigate('Post', { postId: '123' });

// Bad (don't pass objects/functions)
navigation.navigate('Post', { post: postObject });
```

### 4. Auth State
Let AppNavigator handle auth routing:
```typescript
// Good: Just sign out, let AppNavigator handle routing
await supabase.auth.signOut();

// Bad: Manual navigation after auth change
await supabase.auth.signOut();
navigation.navigate('Login'); // Unnecessary
```

### 5. Loading States
Always show loading indicators:
```typescript
if (loading) {
  return <ActivityIndicator />;
}
```

## Troubleshooting

### Tab Bar Not Showing
Check if screen has `headerShown: false` in TabNavigator.

### Deep Links Not Working
Verify URL patterns in AppNavigator's linking config.

### Auth Loop
Check if auth listener is properly cleaned up in useEffect.

### Type Errors
Ensure navigation types are imported from `types/navigation.ts`.

### Screen Flicker
Use `getFocusedRouteNameFromRoute` to control tab bar visibility.

## Testing

### Manual Testing Checklist

- [ ] Login flow works
- [ ] Signup flow works
- [ ] Onboarding displays after signup
- [ ] Tab navigation works
- [ ] Nested navigation works
- [ ] Back button works correctly
- [ ] Deep links open correct screens
- [ ] Logout returns to login
- [ ] Session persists after app restart

### Navigation Testing

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';

test('navigates to post detail', () => {
  const component = (
    <NavigationContainer>
      <FeedScreen />
    </NavigationContainer>
  );
  
  const { getByText } = render(component);
  fireEvent.press(getByText('View Post'));
  
  // Assert navigation occurred
});
```

## Migration Guide

### From React Navigation v5

1. Update imports: `@react-navigation/native@6`
2. Update screen options syntax
3. Add TypeScript types
4. Update deep linking config

### Adding New Screens

1. Create screen component in `src/screens/`
2. Add to appropriate navigator
3. Add types to `src/types/navigation.ts`
4. Add deep link pattern if needed
5. Update documentation

### Customizing Theme

Modify theme in `App.tsx`:
```typescript
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#YOUR_COLOR',
  },
};
```

## Resources

- [React Navigation Docs](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [TypeScript React Navigation](https://reactnavigation.org/docs/typescript/)

## Support

For issues or questions:
1. Check this documentation
2. Review React Navigation docs
3. Check Supabase documentation
4. Review screen implementations for examples

---

Last Updated: 2024
Version: 1.0.0
