import { useState, useEffect } from 'react';
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: SignInData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: signedInUser, error: signInError } = await authService.signIn(credentials);
      if (signInError) throw signInError;
      setUser(signedInUser);
      return { user: signedInUser, error: null };
    } catch (err) {
      const error = err as AuthError;
      setError(error);
      return { user: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: SignUpData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: signedUpUser, error: signUpError } = await authService.signUp(userData);
      if (signUpError) throw signUpError;
      setUser(signedUpUser);
      return { user: signedUpUser, error: null };
    } catch (err) {
      const error = err as AuthError;
      setError(error);
      return { user: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await authService.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      return { error: null };
    } catch (err) {
      const error = err as AuthError;
      setError(error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: resetError } = await authService.resetPassword(email);
      if (resetError) throw resetError;
      return { error: null };
    } catch (err) {
      const error = err as AuthError;
      setError(error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};