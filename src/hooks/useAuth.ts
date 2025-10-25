import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/auth';
import { supabase } from '../services/supabase';
import { User, SignUpData, SignInData, AuthState, AuthError } from '../types';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Clear error after a timeout
  const clearError = useCallback(() => {
    setTimeout(() => {
      setAuthState(prev => ({ ...prev, error: null }));
    }, 5000);
  }, []);

  // Set error with auto-clear
  const setError = useCallback((error: string) => {
    setAuthState(prev => ({ ...prev, error, loading: false }));
    clearError();
  }, [clearError]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { user, error } = await AuthService.getCurrentUser();
        
        if (mounted) {
          if (error) {
            setError(error.message);
          } else {
            setAuthState({
              user,
              loading: false,
              error: null,
            });
          }
        }
      } catch (error) {
        if (mounted) {
          setError('Failed to initialize authentication');
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [setError]);

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            // Get user profile when signed in
            const { user, error } = await AuthService.getCurrentUser();
            if (error) {
              setError(error.message);
            } else {
              setAuthState({
                user,
                loading: false,
                error: null,
              });
            }
          } else if (event === 'SIGNED_OUT') {
            // Clear user state when signed out
            setAuthState({
              user: null,
              loading: false,
              error: null,
            });
          } else if (event === 'TOKEN_REFRESHED') {
            // Optionally refresh user data when token is refreshed
            const { user, error } = await AuthService.getCurrentUser();
            if (!error && user) {
              setAuthState(prev => ({
                ...prev,
                user,
                loading: false,
              }));
            }
          }
        } catch (error) {
          setError('Authentication state change failed');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setError]);

  // Sign up function
  const signUp = useCallback(async (data: SignUpData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { user, error } = await AuthService.signUp(data);
      
      if (error) {
        setError(error.message);
        return false;
      }

      if (user) {
        setAuthState({
          user,
          loading: false,
          error: null,
        });
        return true;
      }

      setError('Sign up failed');
      return false;
    } catch (error) {
      setError('An unexpected error occurred during sign up');
      return false;
    }
  }, [setError]);

  // Sign in function
  const signIn = useCallback(async (data: SignInData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { user, error } = await AuthService.signIn(data);
      
      if (error) {
        setError(error.message);
        return false;
      }

      if (user) {
        setAuthState({
          user,
          loading: false,
          error: null,
        });
        return true;
      }

      setError('Sign in failed');
      return false;
    } catch (error) {
      setError('An unexpected error occurred during sign in');
      return false;
    }
  }, [setError]);

  // Sign out function
  const signOut = useCallback(async (): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await AuthService.signOut();
      
      if (error) {
        setError(error.message);
        return false;
      }

      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
      return true;
    } catch (error) {
      setError('An unexpected error occurred during sign out');
      return false;
    }
  }, [setError]);

  // Update profile function
  const updateProfile = useCallback(async (profileData: Partial<User['profile']>): Promise<boolean> => {
    if (!authState.user) {
      setError('No user logged in');
      return false;
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { user, error } = await AuthService.updateProfile(authState.user.id, profileData);
      
      if (error) {
        setError(error.message);
        return false;
      }

      if (user) {
        setAuthState({
          user,
          loading: false,
          error: null,
        });
        return true;
      }

      setError('Profile update failed');
      return false;
    } catch (error) {
      setError('An unexpected error occurred while updating profile');
      return false;
    }
  }, [authState.user, setError]);

  // Upload avatar function
  const uploadAvatar = useCallback(async (imageUri: string): Promise<string | null> => {
    if (!authState.user) {
      setError('No user logged in');
      return null;
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { avatarUrl, error } = await AuthService.uploadAvatar(authState.user.id, imageUri);
      
      if (error) {
        setError(error.message);
        return null;
      }

      if (avatarUrl) {
        // Update user state with new avatar URL
        setAuthState(prev => ({
          ...prev,
          user: prev.user ? {
            ...prev.user,
            profile: {
              ...prev.user.profile,
              avatar_url: avatarUrl,
            },
          } : null,
          loading: false,
        }));
        return avatarUrl;
      }

      setError('Avatar upload failed');
      return null;
    } catch (error) {
      setError('An unexpected error occurred while uploading avatar');
      return null;
    }
  }, [authState.user, setError]);

  // Reset password function
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await AuthService.resetPassword(email);
      
      if (error) {
        setError(error.message);
        return false;
      }

      setAuthState(prev => ({ ...prev, loading: false }));
      return true;
    } catch (error) {
      setError('An unexpected error occurred while resetting password');
      return false;
    }
  }, [setError]);

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    uploadAvatar,
    resetPassword,
  };
};