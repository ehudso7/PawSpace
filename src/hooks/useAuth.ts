import { useState, useEffect } from 'react';
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
    } finally {
      setLoading(false);
    }
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
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await authService.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { error };
    } finally {
      setLoading(false);
    }
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
