export interface User {
  id: string;
  email: string;
  full_name: string;
  bio?: string;
  location?: string;
  phone?: string;
  profile_photo?: string;
  cover_photo?: string;
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
  user_id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  weight?: number;
  special_needs?: string;
  photo?: string;
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
  before_photo: string;
  after_photo: string;
  service_type: string;
  provider_id?: string;
  created_at: string;
  updated_at: string;
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
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationParams {
  to: string; // Push token
  title: string;
  body: string;
  data?: any;
}

export interface Settings {
  notifications: {
    push: boolean;
    email: boolean;
    booking_reminders: boolean;
    new_followers: boolean;
    comments_likes: boolean;
    promotional_emails: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'private';
    show_location: boolean;
    who_can_message: 'everyone' | 'followers' | 'none';
    blocked_users: string[];
  };
  app: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    data_usage: 'wifi_only' | 'always';
  };
}