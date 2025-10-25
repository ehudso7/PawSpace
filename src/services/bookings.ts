import { supabase } from './supabase';
import { Booking, Service, Provider, BookingStatus } from '@/types';

export interface CreateBookingData {
  serviceId: string;
  providerId: string;
  date: string;
  timeSlot: string;
  notes?: string;
}

export const bookingsService = {
  async getServices(filters?: {
    category?: string;
    location?: string;
    priceRange?: [number, number];
  }): Promise<Service[]> {
    try {
      let query = supabase
        .from('services')
        .select(`
          *,
          provider:providers(*)
        `);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1]);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },

  async getProviders(location?: string): Promise<Provider[]> {
    try {
      let query = supabase
        .from('providers')
        .select(`
          *,
          services(*)
        `);

      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching providers:', error);
      return [];
    }
  },

  async getProviderById(id: string): Promise<Provider | null> {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select(`
          *,
          services(*),
          reviews(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching provider:', error);
      return null;
    }
  },

  async createBooking(bookingData: CreateBookingData): Promise<{ booking: Booking | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { booking: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          userId: user.id,
          status: 'pending' as BookingStatus,
        })
        .select()
        .single();

      if (error) throw error;

      return { booking: data, error: null };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { booking: null, error: 'Failed to create booking' };
    }
  },

  async getUserBookings(): Promise<Booking[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(*),
          provider:providers(*)
        `)
        .eq('userId', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  },

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error updating booking status:', error);
      return { error: 'Failed to update booking status' };
    }
  },

  async getAvailableTimeSlots(providerId: string, date: string): Promise<string[]> {
    try {
      // TODO: Implement logic to fetch available time slots based on provider schedule and existing bookings
      const defaultSlots = [
        '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
      ];

      return defaultSlots;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      return [];
    }
  },
};