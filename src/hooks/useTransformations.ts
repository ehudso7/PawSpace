import { useEffect, useState } from 'react';
import { fetchFeed, type Transformation } from '@/services';

export function useTransformations(): {
  feed: Transformation[];
  loading: boolean;
} {
  const [feed, setFeed] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const data = await fetchFeed();
      if (mounted) setFeed(data);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { feed, loading };
}
