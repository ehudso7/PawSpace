import { useState, useEffect } from 'react';
import { bookingsService, CreateBookingData } from '@/services/bookings';
import { Booking, BookingStatus, Service, Provider } from '@/types';

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
    } catch (_e) {
      setError('Failed to fetch bookings');
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
      if (booking) setBookings(prev => [booking, ...prev]);
      return { success: true, booking };
    } catch (_e) {
      const message = 'Failed to create booking';
      setError(message);
      return { success: false, error: message };
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
      setBookings(prev => prev.map(b => (b.id === bookingId ? { ...b, status } : b)));
      return { success: true };
    } catch (_e) {
      const message = 'Failed to update booking status';
      setError(message);
      return { success: false, error: message };
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

export const useServices = (filters?: { category?: string; location?: string; priceRange?: [number, number] }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const servicesData = await bookingsService.getServices(filters);
      setServices(servicesData);
    } catch (_e) {
      setError('Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchServices();
  }, [filters?.category, filters?.location, filters?.priceRange]);

  return { services, isLoading, error, fetchServices, clearError };
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
    } catch (_e) {
      setError('Failed to fetch providers');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchProviders();
  }, [location]);

  return { providers, isLoading, error, fetchProviders, clearError };
};
