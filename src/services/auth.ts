import { supabase } from './supabase';

export type AuthUser = {
  id: string;
  email: string | null;
};

export async function signInWithEmail(email: string, password: string): Promise<AuthUser | null> {
  // Placeholder: integrate with Supabase auth
  void supabase; // avoid unused for now
  return { id: 'placeholder', email };
}

export async function signOut(): Promise<void> {
  // Placeholder
}
