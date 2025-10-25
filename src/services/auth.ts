import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  name: string;
}

export const authService = {
  async signIn(credentials: AuthCredentials): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    return {
      user: data.user,
      session: data.session,
      error: error as Error | null,
    };
  },

  async signUp(signupData: SignupData): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
    const { email, password, name } = signupData;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    return {
      user: data.user,
      session: data.session,
      error: error as Error | null,
    };
  },

  async signOut(): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.signOut();
    return { error: error as Error | null };
  },

  async getSession(): Promise<{ session: Session | null; error: Error | null }> {
    const { data, error } = await supabase.auth.getSession();
    return {
      session: data.session,
      error: error as Error | null,
    };
  },

  async getCurrentUser(): Promise<{ user: User | null; error: Error | null }> {
    const { data, error } = await supabase.auth.getUser();
    return {
      user: data.user,
      error: error as Error | null,
    };
  },
};

export default authService;
