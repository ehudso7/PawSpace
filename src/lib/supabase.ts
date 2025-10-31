import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('your') || supabaseUrl.includes('placeholder')) {
  console.warn('?? Supabase URL not configured. Authentication features will not work.');
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your') || supabaseAnonKey.includes('placeholder')) {
  console.warn('?? Supabase anon key not configured. Authentication features will not work.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});