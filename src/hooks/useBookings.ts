import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { bookingsService, CreateBookingData } from '@/services/bookings';
import { Booking, Service, Provider, BookingStatus } from '@/types';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userBookings = await bookingsService.getUserBookings();
      setBookings(userBookings);
    } catch (error) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async (bookingData: CreateBookingData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { booking, error } = await bookingsService.createBooking(bookingData);
      
      if (error) {
        setError(error);
        return { success: false, error };
      }

      if (booking) {
        setBookings(prev => [booking, ...prev]);
      }

      return { success: true, booking };
    } catch (error) {
      const errorMessage = 'Failed to create booking';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    setError(null);

    try {
      const { error } = await bookingsService.updateBookingStatus(bookingId, status);
      
      if (error) {
        setError(error);
        return { success: false, error };
      }

      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      return { success: true };
    } catch (error) {
      const errorMessage = 'Failed to update booking status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  return {
    bookings,
    isLoading,
    error,
    fetchUserBookings,
    createBooking,
    updateBookingStatus,
    clearError,
  };
};

export const useServices = (filters?: {
  category?: string;
  location?: string;
  priceRange?: [number, number];
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const servicesData = await bookingsService.getServices(filters);
      setServices(servicesData);
    } catch (error) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchServices();
  }, [filters?.category, filters?.location, filters?.priceRange]);

  return {
    services,
    isLoading,
    error,
    fetchServices,
    clearError,
  };
};

export const useProviders = (location?: string) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const providersData = await bookingsService.getProviders(location);
      setProviders(providersData);
    } catch (error) {
      setError('Failed to fetch providers');
      console.error('Error fetching providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchProviders();
  }, [location]);

  return {
    providers,
    isLoading,
    error,
    fetchProviders,
    clearError,
  };
};
=======
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
>>>>>>> origin/main
