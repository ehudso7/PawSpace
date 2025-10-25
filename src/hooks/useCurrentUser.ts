import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { UserProfile } from '@/types';

export function useAuthUser() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id);
    });
    return () => subscription.subscription?.unsubscribe();
  }, []);
  return userId;
}

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    setLoading(true);
    supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error: err }) => {
        if (!mounted) return;
        if (err) {
          setError(err.message);
        } else if (data) {
          const p: UserProfile = {
            id: data.id,
            email: data.email,
            fullName: data.full_name ?? data.fullName ?? 'User',
            bio: data.bio ?? undefined,
            avatarUrl: data.avatar_url ?? data.avatarUrl ?? undefined,
            coverUrl: data.cover_url ?? data.coverUrl ?? undefined,
            location: data.location ?? undefined,
            phone: data.phone ?? undefined,
            role: (data.role ?? 'owner') as any,
            stats: data.stats ?? undefined,
            businessName: data.business_name ?? undefined,
            businessHours: data.business_hours ?? undefined,
            serviceAreas: data.service_areas ?? undefined,
            specialties: data.specialties ?? undefined,
          };
          setProfile(p);
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [userId]);

  return { profile, loading, error };
}
