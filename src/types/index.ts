export interface User {
  id: string;
  email: string;
  full_name: string;
  bio?: string;
  location?: string;
  phone?: string;
  avatar_url?: string;
  cover_photo_url?: string;
  user_type: 'pet_owner' | 'provider';
  push_token?: string;
  created_at: string;
  updated_at: string;
}

export interface Provider extends User {
  business_name?: string;
  business_hours?: BusinessHours;
  service_areas?: string[];
  specialties?: string[];
  total_bookings?: number;
  rating?: number;
  revenue?: number;
}

export interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  weight?: number;
  special_needs?: string;
  photo_url?: string;
  vaccination_records?: string[];
  created_at: string;
  updated_at: string;
}

export interface Transformation {
  id: string;
  user_id: string;
  pet_id?: string;
  title: string;
  description: string;
  before_photos: string[];
  after_photos: string[];
  service_type: string;
  provider_id?: string;
  is_saved?: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  pet_owner_id: string;
  provider_id: string;
  pet_id: string;
  service_type: string;
  scheduled_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  push_notifications: boolean;
  email_notifications: boolean;
  booking_reminders: boolean;
  new_followers: boolean;
  comments_likes: boolean;
  promotional_emails: boolean;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'private';
  show_location: boolean;
  who_can_message: 'everyone' | 'followers' | 'none';
  blocked_users: string[];
}

export interface AppSettings {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  data_usage: 'low' | 'medium' | 'high';
}

export interface NotificationParams {
  to: string;
  title: string;
  body: string;
  data?: any;
}

export interface AnalyticsEvent {
  name: string;
  parameters?: { [key: string]: any };
}

export type RootStackParamList = {
  Main: undefined;
  Profile: { userId?: string };
  EditProfile: undefined;
  MyPets: undefined;
  AddEditPet: { petId?: string };
  Settings: undefined;
  Notifications: undefined;
  HelpCenter: undefined;
  ContactSupport: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Profile: undefined;
};
