export type UserType = 'owner' | 'provider';

export interface LocationInfo {
  latitude: number | null;
  longitude: number | null;
  name?: string;
}

export interface ProviderDetails {
  businessName?: string;
  businessHours?: string;
  serviceAreas?: string[];
  specialties?: string[];
  servicesOffered?: string[];
  totalBookings?: number;
  rating?: number; // 0-5
  reviewsCount?: number;
  revenueYtd?: number; // own profile only
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  bio?: string;
  phone?: string;
  location?: LocationInfo;
  avatarUrl?: string;
  coverUrl?: string;
  userType: UserType;
  pushToken?: string;
  stats?: {
    transformations: number;
    following: number;
    followers: number;
  };
  providerDetails?: ProviderDetails;
}

export type Species = 'dog' | 'cat' | 'other';

export interface VaccinationRecord {
  name: string;
  uri: string;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed?: string;
  age?: string; // free text or numeric with units
  weight?: string; // free text like "12 kg"
  notes?: string;
  photoUri?: string;
  vaccinations?: VaccinationRecord[];
}

export interface NotificationParams {
  to: string; // Push token
  title: string;
  body: string;
  data?: any;
}

export interface AppSettings {
  notifications: {
    push: boolean;
    email: boolean;
    bookingReminders: boolean;
    newFollowers: boolean;
    commentsLikes: boolean;
    promos: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showLocation: boolean;
    whoCanMessage: 'everyone' | 'followers' | 'no_one';
    blockedUserIds: string[];
  };
  app: {
    language: string; // e.g., 'en'
    theme: 'light' | 'dark' | 'auto';
    dataUsage: 'low' | 'standard' | 'high';
  };
}
