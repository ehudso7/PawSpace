export interface User {
  id: string;
  email: string;
  user_type: 'pet_owner' | 'service_provider';
  profile: UserProfile;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  full_name: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  userType: 'pet_owner' | 'service_provider';
  profile: {
    full_name: string;
    phone?: string;
    location?: string;
    bio?: string;
  };
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  location?: string;
  bio?: string;
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