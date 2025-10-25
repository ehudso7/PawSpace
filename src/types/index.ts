export type UserRole = 'owner' | 'provider';

export interface ProviderInfo {
  businessName?: string;
  businessHours?: string;
  serviceAreas?: string[];
  specialties?: string[];
  servicesOffered?: string[];
  totalBookings?: number;
  rating?: number; // 0-5
  reviewsCount?: number;
  revenueToDate?: number; // only for own profile
}

export interface UserProfile {
  id: string;
  fullName: string;
  bio?: string;
  location?: string;
  phone?: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  coverUrl?: string;
  followersCount?: number;
  followingCount?: number;
  transformationsCount?: number;
  providerInfo?: ProviderInfo;
}

export type Species = 'dog' | 'cat' | 'other';

export interface DocumentFile {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed?: string;
  ageYears?: number;
  weightKg?: number;
  notes?: string;
  photoUrl?: string;
  vaccinationRecords?: DocumentFile[];
}

export interface AppSettings {
  email?: string;
  phone?: string;
  subscriptionStatus?: 'free' | 'pro' | 'trial' | 'expired';

  pushNotifications?: boolean;
  emailNotifications?: boolean;
  bookingReminders?: boolean;
  newFollowers?: boolean;
  commentsLikes?: boolean;
  promotionalEmails?: boolean;

  profileVisibility?: 'public' | 'private';
  showLocation?: boolean;
  whoCanMessage?: 'everyone' | 'followers' | 'no_one';
  blockedUsers?: string[];

  language?: string;
  theme?: 'light' | 'dark' | 'auto';
  dataUsage?: 'low' | 'balanced' | 'high';
}
