import { useState, useEffect } from 'react';
import { authService, AuthUser, SignUpData, SignInData } from '@/services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial user
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: newUser, error: signUpError } = await authService.signUp(data);
      
      if (signUpError) {
        setError(signUpError as Error);
        return { success: false, user: null, error: signUpError };
      }

      setUser(newUser);
      return { success: true, user: newUser, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { success: false, user: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (data: SignInData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: signedInUser, error: signInError } = await authService.signIn(data);
      
      if (signInError) {
        setError(signInError as Error);
        return { success: false, user: null, error: signInError };
      }

      setUser(signedInUser);
      return { success: true, user: signedInUser, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { success: false, user: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signOutError } = await authService.signOut();
      
      if (signOutError) {
        setError(signOutError as Error);
        return { success: false, error: signOutError };
      }

      setUser(null);
      return { success: true, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);

    try {
      const { error: resetError } = await authService.resetPassword(email);
      
      if (resetError) {
        setError(resetError as Error);
        return { success: false, error: resetError };
      }

      return { success: true, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { success: false, error };
    }
  };

  const clearError = () => setError(null);

  return {
    user,
    isLoading,
    loading: isLoading, // Alias for compatibility
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError,
    isAuthenticated: !!user,
  };
};

export default useAuth;
