import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

let supabase: SupabaseClient | undefined;

const extra = (Constants?.expoConfig?.extra || Constants?.manifest?.extra || {}) as any;
const SUPABASE_URL = extra?.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = extra?.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (isSupabaseConfigured) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export function getSupabase(): SupabaseClient | undefined {
  return supabase;
}

export async function updateUserPushToken(userId: string, token: string): Promise<void> {
  if (!supabase) return;
  await supabase.from('users').update({ push_token: token }).eq('id', userId);
}
