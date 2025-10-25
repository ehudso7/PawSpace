import { supabase } from './supabase';
<<<<<<< HEAD
import { User, AuthError } from '@/types';
=======
<<<<<<< HEAD
import type { User, Session } from '@supabase/supabase-js';

export interface AuthCredentials {
=======
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser extends User {
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}
>>>>>>> origin/main

export interface SignUpData {
  email: string;
  password: string;
<<<<<<< HEAD
  name: string;
  phone?: string;
}

export interface SignInData {
=======
  fullName: string;
}

export interface SignInData {
>>>>>>> origin/main
>>>>>>> origin/main
  email: string;
  password: string;
}

<<<<<<< HEAD
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
=======
<<<<<<< HEAD
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
=======
export const authService = {
  async signUp({ email, password, fullName }: SignUpData) {
>>>>>>> origin/main
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
<<<<<<< HEAD
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
=======
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  async signIn({ email, password }: SignInData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user as AuthUser | null;
  },

  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as AuthUser || null);
    });
  },
};
>>>>>>> origin/main
>>>>>>> origin/main
