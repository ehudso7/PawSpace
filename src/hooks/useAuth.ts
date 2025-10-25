import { useState, useEffect } from 'react';
import type { AuthUser } from '@/services';

export function useAuth(): {
  user: AuthUser | null;
  loading: boolean;
} {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Placeholder: wire to auth state changes
    setLoading(false);
  }, []);

  return { user, loading };
}
