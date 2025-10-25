/**
 * Custom React hook for managing authentication state
 * Provides auth methods and state throughout the app
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import * as authService from '../services/auth';
import { User, UserType, AuthError } from '../types';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (
    email: string,
    password: string,
    userType: UserType,
    profileData: {
      full_name: string;
      phone?: string;
      location?: string;
    }
  ) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

/**
 * Custom hook for authentication
 * Manages auth state and provides auth methods
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Convert AuthError to user-friendly message
   */
  const getErrorMessage = (error: AuthError | null): string => {
    if (!error) return 'An unexpected error occurred';

    const message = error.message.toLowerCase();

    // Map common error messages to user-friendly ones
    if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
      return 'Invalid email or password. Please try again.';
    }
    if (message.includes('email already registered') || message.includes('user already registered')) {
      return 'This email is already registered. Please sign in instead.';
    }
    if (message.includes('invalid email')) {
      return 'Please enter a valid email address.';
    }
    if (message.includes('password')) {
      return 'Password must be at least 6 characters long.';
    }
    if (message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (message.includes('too many requests')) {
      return 'Too many attempts. Please try again later.';
    }

    // Return original message if no match
    return error.message;
  };

  /**
   * Initialize auth state and listen for changes
   */
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { user: currentUser, error } = await authService.getCurrentUser();
        
        if (error) {
          console.error('Error getting current user:', error);
          setError(getErrorMessage(error));
        }
        
        setUser(currentUser);
      } catch (err: any) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          // Fetch full user data with profile
          const { user: currentUser, error } = await authService.getCurrentUser();
          
          if (error) {
            console.error('Error fetching user after sign in:', error);
            setError(getErrorMessage(error));
          } else {
            setUser(currentUser);
          }
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          // Optionally refresh user data
          const { user: currentUser } = await authService.getCurrentUser();
          setUser(currentUser);
        } else if (event === 'USER_UPDATED') {
          // Refresh user data
          const { user: currentUser } = await authService.getCurrentUser();
          setUser(currentUser);
        }
      }
    );

    // Cleanup listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign in user with email and password
   */
  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { user: signedInUser, error: signInError } = await authService.signIn(
        email,
        password
      );

      if (signInError) {
        setError(getErrorMessage(signInError));
        return false;
      }

      if (!signedInUser) {
        setError('Failed to sign in. Please try again.');
        return false;
      }

      setUser(signedInUser);
      return true;
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign up new user
   */
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      userType: UserType,
      profileData: {
        full_name: string;
        phone?: string;
        location?: string;
      }
    ): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const { user: newUser, error: signUpError } = await authService.signUp(
          email,
          password,
          userType,
          profileData
        );

        if (signUpError) {
          setError(getErrorMessage(signUpError));
          return false;
        }

        if (!newUser) {
          setError('Failed to create account. Please try again.');
          return false;
        }

        setUser(newUser);
        return true;
      } catch (err: any) {
        console.error('Sign up error:', err);
        setError('An unexpected error occurred. Please try again.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Sign out current user
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error: signOutError } = await authService.signOut();

      if (signOutError) {
        setError(getErrorMessage(signOutError));
        return;
      }

      setUser(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh current user data
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const { user: currentUser, error } = await authService.getCurrentUser();
      
      if (error) {
        console.error('Error refreshing user:', error);
        setError(getErrorMessage(error));
      } else {
        setUser(currentUser);
      }
    } catch (err: any) {
      console.error('Error refreshing user:', err);
      setError('Failed to refresh user data');
    }
  }, []);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
    refreshUser,
  };
};
