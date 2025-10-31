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
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user as User || null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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
  };

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
    } catch (error) {
      const authError = { message: 'An unexpected error occurred' };
      setError(authError);
      return { success: false, error: authError };
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
      return { error };
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };
};

export default useAuth;
