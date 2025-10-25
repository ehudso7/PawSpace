import { useState, useEffect, useCallback } from 'react';
import { User, SignUpData, SignInData, UpdateProfileData, AuthError } from '../types';
import { AuthService } from '../services/auth';
import { supabase } from '../services/supabase';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error: string | null }>;
  signIn: (data: SignInData) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<{ success: boolean; error: string | null }>;
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error: string | null }>;
  uploadAvatar: (imageUri: string) => Promise<{ success: boolean; error: string | null }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: string | null }>;
  selectImage: () => Promise<{ uri: string | null; error: string | null }>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user: currentUser, error } = await AuthService.getCurrentUser();
        if (error) {
          console.error('Error getting current user:', error.message);
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { user: currentUser, error } = await AuthService.getCurrentUser();
          if (!error) {
            setUser(currentUser);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (data: SignUpData): Promise<{ success: boolean; error: string | null }> => {
    setLoading(true);
    try {
      const { user: newUser, error } = await AuthService.signUp(data);
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (newUser) {
        setUser(newUser);
        return { success: true, error: null };
      }

      return { success: false, error: 'Failed to create user account' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (data: SignInData): Promise<{ success: boolean; error: string | null }> => {
    setLoading(true);
    try {
      const { user: signedInUser, error } = await AuthService.signIn(data);
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (signedInUser) {
        setUser(signedInUser);
        return { success: true, error: null };
      }

      return { success: false, error: 'Failed to sign in' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<{ success: boolean; error: string | null }> => {
    setLoading(true);
    try {
      const { error } = await AuthService.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      setUser(null);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<{ success: boolean; error: string | null }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    try {
      const { user: updatedUser, error } = await AuthService.updateProfile(user.id, data);
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (updatedUser) {
        setUser(updatedUser);
        return { success: true, error: null };
      }

      return { success: false, error: 'Failed to update profile' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const uploadAvatar = useCallback(async (imageUri: string): Promise<{ success: boolean; error: string | null }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    try {
      const { url, error } = await AuthService.uploadAvatar(imageUri);
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (url) {
        // Update user state with new avatar URL
        setUser(prevUser => prevUser ? {
          ...prevUser,
          profile: {
            ...prevUser.profile,
            avatar_url: url
          }
        } : null);
        return { success: true, error: null };
      }

      return { success: false, error: 'Failed to upload avatar' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error: string | null }> => {
    setLoading(true);
    try {
      const { error } = await AuthService.resetPassword(email);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  const selectImage = useCallback(async (): Promise<{ uri: string | null; error: string | null }> => {
    try {
      const { uri, error } = await AuthService.selectImage();
      
      if (error) {
        return { uri: null, error: error.message };
      }

      return { uri, error: null };
    } catch (error) {
      return { uri: null, error: 'An unexpected error occurred' };
    }
  }, []);

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    uploadAvatar,
    resetPassword,
    selectImage,
  };
};