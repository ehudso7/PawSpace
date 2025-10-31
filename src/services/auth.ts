import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser extends User {
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
}

export const authService = {
  async signUp({ email, password, fullName }: SignUpData): Promise<{ data: { user: AuthUser | null; session: Session | null } | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      return { data: { user: data.user as AuthUser, session: data.session }, error: null };
    } catch (error) {
      return { data: null, error: { message: 'An unexpected error occurred' } };
    }
  },

  async signIn({ email, password }: SignInData): Promise<{ data: { user: AuthUser | null; session: Session | null } | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      return { data: { user: data.user as AuthUser, session: data.session }, error: null };
    } catch (error) {
      return { data: null, error: { message: 'An unexpected error occurred' } };
    }
  },

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: { message: error.message } };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } };
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user as AuthUser | null;
    } catch (error) {
      return null;
    }
  },

  async getSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      return null;
    }
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as AuthUser || null);
    });
  },

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return { error: { message: error.message } };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } };
    }
  },
};

export default authService;