/**
 * User and authentication related types for PawSpace
 */

export type UserType = 'pet_owner' | 'service_provider';

export interface UserProfile {
  full_name: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  user_type: UserType;
  profile: UserProfile;
}

export interface SignUpData {
  email: string;
  password: string;
  userType: UserType;
  profile: {
    full_name: string;
    phone?: string;
    location?: string;
  };
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
