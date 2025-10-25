export interface User {
  id: string;
  email: string;
  user_type: 'pet_owner' | 'service_provider';
  profile: UserProfile;
}

export interface UserProfile {
  full_name: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  userType: 'pet_owner' | 'service_provider';
  profile: Omit<UserProfile, 'avatar_url'>;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string;
}