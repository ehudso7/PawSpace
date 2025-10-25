import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file or app.config.js');
}

// Create Supabase client with AsyncStorage for auth persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          location: string | null;
          bio: string | null;
          user_type: 'pet_owner' | 'service_provider';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          user_type: 'pet_owner' | 'service_provider';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          user_type?: 'pet_owner' | 'service_provider';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type TypedSupabaseClient = typeof supabase;