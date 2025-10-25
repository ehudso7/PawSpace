import { useEffect, useState } from 'react';
import { fetchMyBookings, type Booking } from '@/services';

export function useBookings(userId?: string): {
  bookings: Booking[];
  loading: boolean;
} {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(!!userId);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!userId) return;
      setLoading(true);
      const data = await fetchMyBookings(userId);
      if (mounted) setBookings(data);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [userId]);

  return { bookings, loading };
}
