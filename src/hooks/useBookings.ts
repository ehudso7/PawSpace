import { useState, useEffect } from 'react';
<<<<<<< HEAD
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
=======
import { bookingService } from '@/services/bookings';
import { Booking, Service, Provider } from '@/types/database';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getUserBookings(userId);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
>>>>>>> origin/main
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
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
=======
  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getServices();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getProviders();
      setProviders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch providers');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newBooking = await bookingService.createBooking(bookingData);
      setBookings(prev => [newBooking, ...prev]);
      return { data: newBooking, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    setLoading(true);
    setError(null);
    try {
      await bookingService.cancelBooking(bookingId);
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      );
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
>>>>>>> origin/main
    }
  };

  return {
    bookings,
<<<<<<< HEAD
    loading,
    error,
    refetch: fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking,
  };
};

export default useBookings;
=======
    services,
    providers,
    loading,
    error,
    fetchBookings,
    fetchServices,
    fetchProviders,
    createBooking,
    cancelBooking,
  };
};
>>>>>>> origin/main
