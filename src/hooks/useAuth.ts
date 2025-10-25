import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { supabase } from '@/services/supabase';
import { authService, SignUpData, SignInData } from '@/services/auth';
import { User, AuthError } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user as User || null);
        setIsLoading(false);
      }
    );
=======
<<<<<<< HEAD
import { User } from '@supabase/supabase-js';
import { supabase, authService } from '@/services';
import type { AuthCredentials, SignupData } from '@/services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { session } = await authService.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: AuthCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const { user: signedInUser, error: signInError } = await authService.signIn(credentials);
      if (signInError) throw signInError;
      setUser(signedInUser);
      return { user: signedInUser, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { user: null, error };
=======
import { authService, AuthUser } from '@/services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    authService.getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });
>>>>>>> origin/main

    return () => subscription.unsubscribe();
  }, []);

<<<<<<< HEAD
  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: newUser, error } = await authService.signUp(data);
      
      if (error) {
        setError(error);
        return { success: false, error };
      }

      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      const authError = { message: 'An unexpected error occurred' };
      setError(authError);
      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (data: SignInData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: signedInUser, error } = await authService.signIn(data);
      
      if (error) {
        setError(error);
        return { success: false, error };
      }

      setUser(signedInUser);
      return { success: true, user: signedInUser };
    } catch (error) {
      const authError = { message: 'An unexpected error occurred' };
      setError(authError);
      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
=======
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await authService.signIn({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
>>>>>>> origin/main
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const signUp = async (signupData: SignupData) => {
    setLoading(true);
    setError(null);
    try {
      const { user: newUser, error: signUpError } = await authService.signUp(signupData);
      if (signUpError) throw signUpError;
      setUser(newUser);
      return { user: newUser, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { user: null, error };
=======
  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { data, error } = await authService.signUp({ email, password, fullName });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
>>>>>>> origin/main
    } finally {
      setLoading(false);
>>>>>>> origin/main
    }
  };

  const signOut = async () => {
<<<<<<< HEAD
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await authService.signOut();
      
      if (error) {
        setError(error);
        return { success: false, error };
      }

      setUser(null);
      return { success: true };
    } catch (error) {
      const authError = { message: 'An unexpected error occurred' };
      setError(authError);
      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);

    try {
      const { error } = await authService.resetPassword(email);
      
      if (error) {
        setError(error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      const authError = { message: 'An unexpected error occurred' };
      setError(authError);
      return { success: false, error: authError };
    }
  };

  const clearError = () => setError(null);

  return {
    user,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError,
  };
};
=======
    setLoading(true);
<<<<<<< HEAD
    setError(null);
    try {
      const { error: signOutError } = await authService.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
=======
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
>>>>>>> origin/main
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
<<<<<<< HEAD
    error,
    signIn,
    signUp,
    signOut,
  };
};

export default useAuth;
=======
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };
};
>>>>>>> origin/main
>>>>>>> origin/main
