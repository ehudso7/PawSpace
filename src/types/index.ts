export type UserRole = 'owner' | 'provider';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  phone?: string;
  role: UserRole;
  stats?: {
    transformations: number;
    following: number;
    followers: number;
    totalBookings?: number;
    rating?: number; // 0-5
    reviewsCount?: number;
    revenue?: number; // own profile only
  };
  // Provider-only
  businessName?: string;
  businessHours?: string;
  serviceAreas?: string[];
  specialties?: string[];
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed?: string;
  age?: string;
  weightKg?: number;
  notes?: string;
  photoUrl?: string;
  vaccinationFiles?: string[];
}

export interface UserSettings {
  id: string; // user id
  account: {
    email: string;
    phone?: string;
    subscriptionStatus?: 'free' | 'pro' | 'business';
  };
  notifications: {
    push: boolean;
    email: boolean;
    bookingReminders: boolean;
    newFollowers: boolean;
    commentsLikes: boolean;
    promotions: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showLocation: boolean;
    whoCanMessage: 'everyone' | 'followers' | 'no_one';
    blockedUsers: string[];
  };
  app: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    dataUsage?: 'low' | 'normal' | 'high';
    appVersion?: string;
  };
}
