import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl: string = (Constants.expoConfig?.extra as any)?.supabaseUrl;
const supabaseAnonKey: string = (Constants.expoConfig?.extra as any)?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Supabase URL or Anon Key is missing from app.json extra.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
