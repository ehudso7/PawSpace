import { useState, useEffect } from 'react';
import { bookingsService, type Booking } from '@/services/bookings';

export const useBookings = (userId: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await bookingsService.getBookings(userId);
      if (fetchError) throw fetchError;
      setBookings(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at'>) => {
    setError(null);
    try {
      const { data, error: createError } = await bookingsService.createBooking(bookingData);
      if (createError) throw createError;
      if (data) {
        setBookings([data, ...bookings]);
      }
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { data: null, error };
    }
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    setError(null);
    try {
      const { data, error: updateError } = await bookingsService.updateBooking(id, updates);
      if (updateError) throw updateError;
      if (data) {
        setBookings(bookings.map(b => b.id === id ? data : b));
      }
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { data: null, error };
    }
  };

  const cancelBooking = async (id: string) => {
    setError(null);
    try {
      const { data, error: cancelError } = await bookingsService.cancelBooking(id);
      if (cancelError) throw cancelError;
      if (data) {
        setBookings(bookings.map(b => b.id === id ? data : b));
      }
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { data: null, error };
    }
  };

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking,
  };
};

export default useBookings;
