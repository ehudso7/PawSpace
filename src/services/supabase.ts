import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // In dev, we will just warn; runtime checks can be added later
  console.warn('Supabase env vars are not set');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
