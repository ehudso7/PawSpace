import { supabase } from './supabase';
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

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
>>>>>>> origin/main
  email: string;
  password: string;
}

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
