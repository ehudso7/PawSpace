import { useEffect, useMemo, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase';
import type { User as AppUser } from '../types';
import { getCurrentUser, signIn as svcSignIn, signOut as svcSignOut, signUp as svcSignUp } from '../services/auth';

interface UseAuthReturn {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userType: 'pet_owner' | 'service_provider',
    profileData: { full_name: string; phone?: string; location?: string; bio?: string; avatar_url?: string }
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const friendlyError = (err: unknown): string => {
  const message = (err as any)?.message || 'Something went wrong. Please try again.';
  if (typeof message !== 'string') return 'Something went wrong. Please try again.';
  if (/Invalid login credentials/i.test(message)) return 'Incorrect email or password.';
  if (/rate limit/i.test(message)) return 'Too many attempts. Please try later.';
  if (/email.*not confirmed/i.test(message)) return 'Please confirm your email to continue.';
  return message;
};

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const u = await getCurrentUser();
      setUser(u);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, _session) => {
      // Refresh user whenever auth state changes
      loadUser();
    });

    return () => {
      subscription.subscription?.unsubscribe();
    };
  }, [loadUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      setLoading(true);
      await svcSignIn(email, password);
      await loadUser();
    } catch (err) {
      const msg = friendlyError(err);
      setError(msg);
      Alert.alert('Login failed', msg);
    } finally {
      setLoading(false);
    }
  }, [loadUser]);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      userType: 'pet_owner' | 'service_provider',
      profileData: { full_name: string; phone?: string; location?: string; bio?: string; avatar_url?: string }
    ) => {
      setError(null);
      try {
        setLoading(true);
        await svcSignUp(email, password, userType, profileData);
        await loadUser();
      } catch (err) {
        const msg = friendlyError(err);
        setError(msg);
        Alert.alert('Sign up failed', msg);
      } finally {
        setLoading(false);
      }
    },
    [loadUser]
  );

  const signOut = useCallback(async () => {
    setError(null);
    try {
      setLoading(true);
      await svcSignOut();
      setUser(null);
    } catch (err) {
      const msg = friendlyError(err);
      setError(msg);
      Alert.alert('Sign out failed', msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(
    () => ({ user, loading, error, signIn, signUp, signOut }),
    [user, loading, error, signIn, signUp, signOut]
  );
}
