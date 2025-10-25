import { createClient } from '@supabase/supabase-js';
<<<<<<< HEAD
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
=======
<<<<<<< HEAD
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
>>>>>>> origin/main
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

<<<<<<< HEAD
export default supabase;
=======
export default supabase;
=======
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
>>>>>>> origin/main
>>>>>>> origin/main
