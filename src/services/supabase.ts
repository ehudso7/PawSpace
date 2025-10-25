import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  location?: string;
  phone?: string;
  is_provider: boolean;
  business_name?: string;
  business_hours?: string;
  service_areas?: string[];
  specialties?: string[];
  push_token?: string;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed?: string;
  age?: number;
  weight?: number;
  photo_url?: string;
  special_needs?: string;
  vaccination_records?: string[];
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  push_notifications: boolean;
  email_notifications: boolean;
  booking_reminders: boolean;
  new_followers: boolean;
  comments_likes: boolean;
  promotional_emails: boolean;
  profile_visibility: 'public' | 'private';
  show_location: boolean;
  message_permissions: 'everyone' | 'followers' | 'none';
  language: string;
  theme: 'light' | 'dark' | 'auto';
  created_at: string;
  updated_at: string;
}

export interface Transformation {
  id: string;
  user_id: string;
  pet_id: string;
  before_image_url: string;
  after_image_url: string;
  description: string;
  likes_count: number;
  comments_count: number;
  is_saved?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface SavedTransformation {
  id: string;
  user_id: string;
  transformation_id: string;
  created_at: string;
}