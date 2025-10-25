import { supabase } from './supabase';

export interface Booking {
  id: string;
  user_id: string;
  provider_id: string;
  service_id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export const bookingsService = {
  async createBooking(bookingData: Omit<Booking, 'id' | 'created_at'>): Promise<{ data: Booking | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    return {
      data: data as Booking | null,
      error: error as Error | null,
    };
  },

  async getBookings(userId: string): Promise<{ data: Booking[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    return {
      data: data as Booking[] | null,
      error: error as Error | null,
    };
  },

  async getBookingById(id: string): Promise<{ data: Booking | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    return {
      data: data as Booking | null,
      error: error as Error | null,
    };
  },

  async updateBooking(id: string, updates: Partial<Booking>): Promise<{ data: Booking | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return {
      data: data as Booking | null,
      error: error as Error | null,
    };
  },

  async cancelBooking(id: string): Promise<{ data: Booking | null; error: Error | null }> {
    return this.updateBooking(id, { status: 'cancelled' });
  },
};

export default bookingsService;
