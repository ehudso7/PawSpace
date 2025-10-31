import { useState, useEffect } from 'react';
import { authService, AuthUser } from '@/services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial user
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError('Failed to get current user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await authService.signIn({ email, password });
      if (signInError) {
        setError(signInError.message);
        return { success: false, error: signInError.message };
      }
      if (data?.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: 'Sign in failed' };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await authService.signUp({ email, password, fullName });
      if (signUpError) {
        setError(signUpError.message);
        return { success: false, error: signUpError.message };
      }
      if (data?.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: 'Sign up failed' };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await authService.signOut();
      if (signOutError) {
        setError(signOutError.message);
        return { success: false, error: signOutError.message };
      }
      setUser(null);
      return { success: true };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      const { error: resetError } = await authService.resetPassword(email);
      if (resetError) {
        setError(resetError.message);
        return { success: false, error: resetError.message };
      }
      return { success: true };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => setError(null);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    clearError,
    isAuthenticated: !!user,
  };
};

export default useAuth;