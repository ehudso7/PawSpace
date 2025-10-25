import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: undefined, // TODO: Implement session persistence by providing a storage implementation.
    // For Expo/React Native, use AsyncStorage from '@react-native-async-storage/async-storage':
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // storage: AsyncStorage,
    // See Supabase docs: https://supabase.com/docs/guides/auth/auth-helpers/auth-ui#react-native
    // If using a custom storage, ensure it implements getItem, setItem, removeItem methods.
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
