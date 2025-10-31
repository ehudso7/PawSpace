import { supabase } from './supabase';
import { User, AuthError } from '@/types';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
          },
        },
      });

      if (error) {
        return { user: null, error: { message: error.message } };
      }

      return { user: authData.user as User, error: null };
    } catch (error) {
      return { user: null, error: { message: 'An unexpected error occurred' } };
    }
  },

  async signIn(data: SignInData): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return { user: null, error: { message: error.message } };
      }

      return { user: authData.user as User, error: null };
    } catch (error) {
      return { user: null, error: { message: 'An unexpected error occurred' } };
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

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user as User;
    } catch (error) {
      return null;
    }
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
