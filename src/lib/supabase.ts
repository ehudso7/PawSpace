import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (process.env.EXPO_PUBLIC_SUPABASE_URL as string) ||
  (process.env.SUPABASE_URL as string);

const supabaseAnonKey =
  (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string) ||
  (process.env.SUPABASE_ANON_KEY as string);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase credentials are not set. Define SUPABASE_URL and SUPABASE_ANON_KEY (or EXPO_PUBLIC_ variants).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as unknown as Storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
