export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  cover_photo_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
  user_type: 'pet_owner' | 'provider';
  created_at: string;
  push_token?: string;
  
  // Provider-specific fields
  business_name?: string;
  business_hours?: BusinessHours;
  service_areas?: string[];
  specialties?: string[];
  rating?: number;
  total_reviews?: number;
  total_bookings?: number;
  revenue?: number;
  
  // Stats
  transformations_count: number;
  followers_count: number;
  following_count: number;
  
  // Settings
  settings?: UserSettings;
}

export interface BusinessHours {
  monday?: TimeSlot;
  tuesday?: TimeSlot;
  wednesday?: TimeSlot;
  thursday?: TimeSlot;
  friday?: TimeSlot;
  saturday?: TimeSlot;
  sunday?: TimeSlot;
}

export interface TimeSlot {
  open: string; // HH:MM format
  close: string; // HH:MM format
  closed?: boolean;
}

export interface UserSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  app: AppSettings;
}

export interface NotificationSettings {
  push_enabled: boolean;
  email_enabled: boolean;
  booking_reminders: boolean;
  new_followers: boolean;
  comments_likes: boolean;
  promotional_emails: boolean;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'private';
  show_location: boolean;
  who_can_message: 'everyone' | 'followers' | 'none';
}

export interface AppSettings {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  data_saver: boolean;
}

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  photo_url?: string;
  species: 'dog' | 'cat' | 'other';
  breed?: string;
  age?: number;
  weight?: number;
  special_needs?: string;
  vaccination_records?: VaccinationRecord[];
  created_at: string;
  updated_at: string;
}

export interface VaccinationRecord {
  id: string;
  name: string;
  date: string;
  file_url?: string;
}

export interface Transformation {
  id: string;
  user_id: string;
  pet_id?: string;
  provider_id?: string;
  before_photo_url?: string;
  after_photo_url: string;
  caption?: string;
  service_type?: string;
  location?: string;
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  is_saved?: boolean;
  created_at: string;
  user?: User;
  pet?: Pet;
  provider?: User;
}

export interface Service {
  id: string;
  provider_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number; // in minutes
  photos: string[];
  rating?: number;
  reviews_count?: number;
  created_at: string;
  provider?: User;
}

export interface Booking {
  id: string;
  user_id: string;
  provider_id: string;
  service_id: string;
  pet_id?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
  created_at: string;
  user?: User;
  provider?: User;
  service?: Service;
  pet?: Pet;
}

export interface Review {
  id: string;
  booking_id: string;
  user_id: string;
  provider_id: string;
  rating: number;
  comment?: string;
  photos?: string[];
  created_at: string;
  user?: User;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface BlockedUser {
  id: string;
  user_id: string;
  blocked_user_id: string;
  created_at: string;
  blocked_user?: User;
}

export interface SavedTransformation {
  id: string;
  user_id: string;
  transformation_id: string;
  created_at: string;
  transformation?: Transformation;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}
