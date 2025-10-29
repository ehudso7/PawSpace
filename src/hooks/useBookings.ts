import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { Booking, Service, Provider, BookingStatus } from '@/types';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(*),
          provider:providers(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async (bookingData: {
    serviceId: string;
    providerId: string;
    date: string;
    time: string;
    notes?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          service_id: bookingData.serviceId,
          provider_id: bookingData.providerId,
          date: bookingData.date,
          time: bookingData.time,
          notes: bookingData.notes,
          status: 'pending' as BookingStatus,
        })
        .select(`
          *,
          service:services(*),
          provider:providers(*)
        `)
        .single();

      if (error) throw error;
      setBookings(prev => [data, ...prev]);
      return { success: true, booking: data };
    } catch (error) {
      const errorMessage = 'Failed to create booking';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select(`
          *,
          service:services(*),
          provider:providers(*)
        `)
        .single();

      if (error) throw error;
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? data : booking
      ));
      return { success: true, booking: data };
    } catch (error) {
      const errorMessage = 'Failed to update booking status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    return updateBookingStatus(bookingId, 'cancelled');
  };

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
    cancelBooking,
  };
};

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    isLoading,
    error,
    fetchServices,
  };
};

export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('providers')
        .select(`
          *,
          user:users(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      setError('Failed to fetch providers');
      console.error('Error fetching providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return {
    providers,
    isLoading,
    error,
    fetchProviders,
  };
};