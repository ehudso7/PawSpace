import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { analyticsService } from '../services/analytics';
import { errorTrackingService } from '../services/errorTracking';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          analyticsService.setUserId(session.user.id);
          errorTrackingService.setUser({
            id: session.user.id,
            email: session.user.email,
          });
        }
      } catch (error) {
        errorTrackingService.captureException(error as Error, {
          context: 'useAuth.getSession',
        });
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          analyticsService.setUserId(session.user.id);
          errorTrackingService.setUser({
            id: session.user.id,
            email: session.user.email,
          });
        } else {
          // Clear user data on logout
          analyticsService.setUserId('');
          errorTrackingService.setUser({ id: '' });
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      analyticsService.logEvent('user_logout');
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'useAuth.signOut',
      });
      throw error;
    }
  };

  return {
    user,
    loading,
    signOut,
  };
};