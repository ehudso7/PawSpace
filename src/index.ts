/**
 * Auth Module Exports
 * Centralized exports for all authentication-related functionality
 */

// Screens
export { LoginScreen } from './screens/auth/LoginScreen';
export { SignupScreen } from './screens/auth/SignupScreen';
export { 
  OnboardingScreen, 
  hasCompletedOnboarding, 
  resetOnboarding 
} from './screens/auth/OnboardingScreen';

// Hooks
export { useAuth } from './hooks/useAuth';

// Services
export {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  updateProfile,
  uploadAvatar,
  sendPasswordResetEmail,
} from './services/auth';

export { supabase } from './services/supabase';

// Types
export type {
  User,
  UserProfile,
  UserType,
  SignUpData,
  AuthError,
  ValidationResult,
} from './types';

// Validators
export {
  validateEmail,
  validatePassword,
  validatePhone,
  validateFullName,
  passwordsMatch,
} from './utils/validators';
