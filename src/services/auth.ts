import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser extends User {
  user_metadata: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    phone?: string;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
  fullName?: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData) {
    const { email, password, name, fullName, phone } = data;
    const displayName = fullName || name || '';
    
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
          name: displayName,
          phone,
        },
      },
    });
    
    return { 
      user: authData.user as AuthUser | null, 
      session: authData.session,
      error 
    };
  },

  async signIn({ email, password }: SignInData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { 
      user: data.user as AuthUser | null,
      session: data.session,
      error 
    };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user as AuthUser | null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async getSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as AuthUser || null);
    });
  },
};

export default authService;
