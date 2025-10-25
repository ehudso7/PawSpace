import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types';
import { AnalyticsService } from '@/services/analytics';

interface AuthContextValue {
  currentUser: UserProfile | null;
  setCurrentUser: (u: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'auth_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const parsed = JSON.parse(json) as UserProfile;
          setCurrentUser(parsed);
        } else {
          // demo default user
          const demo: UserProfile = {
            id: 'demo-user-1',
            email: 'demo@example.com',
            fullName: 'Demo User',
            bio: 'Pet lover and proud owner of two dogs.',
            phone: '',
            userType: 'owner',
            stats: { transformations: 12, following: 80, followers: 150 },
            location: { latitude: null, longitude: null, name: 'San Francisco, CA' },
            avatarUrl: undefined,
            coverUrl: undefined,
          };
          setCurrentUser(demo);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    const analytics = new AnalyticsService();
    if (currentUser?.id) {
      analytics.setUserId(currentUser.id);
      if (currentUser.userType) analytics.setUserProperty('user_type', currentUser.userType);
    }
  }, [currentUser?.id]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates } as UserProfile;
    setCurrentUser(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [currentUser]);

  const logout = useCallback(async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({ currentUser, setCurrentUser, updateProfile, logout }), [currentUser, updateProfile, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
