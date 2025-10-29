import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { authService, SignUpData, SignInData } from '@/services/auth';
import { User, AuthError } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (_error) {
        // swallow
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const supaUser = session?.user;
      const mappedUser: User | null = supaUser
        ? {
            id: supaUser.id,
            email: supaUser.email ?? '',
            name: (supaUser.user_metadata as any)?.name ?? '',
            avatar: (supaUser.user_metadata as any)?.avatar_url,
          }
        : null;
      setUser(mappedUser);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    } catch (_e) {
      const authError = { message: 'An unexpected error occurred' };
      setError(authError);
      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
    }
  };

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
    } catch (_e) {
      const authError = { message: 'An unexpected error occurred' };
      setError(authError);
      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
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
    } catch (_e) {
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
    } catch (_e) {
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
