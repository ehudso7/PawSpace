import { createClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '../config/appConfig';

// Get Supabase configuration from centralized config
const SUPABASE_URL = APP_CONFIG.supabase.url;
const SUPABASE_ANON_KEY = APP_CONFIG.supabase.anonKey;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Warning: Supabase configuration is missing. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
