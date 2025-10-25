import { supabase } from './supabase';
<<<<<<< HEAD
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
=======
<<<<<<< HEAD

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
=======
import { Booking, Service, Provider } from '@/types/database';

export const bookingService = {
  async getServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getServiceById(id: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProviders(): Promise<Provider[]> {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getProviderById(id: string): Promise<Provider | null> {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service:services(*),
        provider:providers(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async updateBooking(id: string, updates: Partial<Booking>) {
>>>>>>> origin/main
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
<<<<<<< HEAD

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
=======
    
    if (error) throw error;
    return data;
  },

  async cancelBooking(id: string) {
    return this.updateBooking(id, { status: 'cancelled' });
  },
};
import { Service, ServiceFilters } from '../types/service';
import { MOCK_SERVICES } from '../mock/services';
import { Coordinate, getUserLocationSafe, haversineDistanceMiles } from '../utils/geo';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

function matchesQuery(service: Service, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return (
    normalize(service.title).includes(q) ||
    normalize(service.provider.name).includes(q)
  );
}

function isAvailableMatch(service: Service, value: string): boolean {
  if (!value) return true;
  const today = new Date();
  const dateOnly = (d: Date) => d.toISOString().slice(0, 10);
  const slots = service.availability_slots.filter((s) => s.isAvailable);

  if (value === 'today') {
    const t = dateOnly(today);
    return slots.some((slot) => slot.start.slice(0, 10) === t);
  }
  if (value === 'this_week') {
    const start = new Date(today);
    const end = new Date(today);
    end.setDate(end.getDate() + 7);
    return slots.some((slot) => {
      const d = new Date(slot.start);
      return d >= start && d <= end;
    });
  }
  // Expect yyyy-mm-dd or full ISO; compare by date
  const isoDate = value.slice(0, 10);
  return slots.some((slot) => slot.start.slice(0, 10) === isoDate);
}

function applyFilters(services: Service[], filters: ServiceFilters, userLoc: Coordinate | null): Service[] {
  const { service_type, min_price, max_price, max_distance, availability_date, sort_by } = filters;
  let result = services.filter((svc) => {
    if (service_type && service_type !== 'all' && svc.service_type !== (service_type as any)) return false;
    if (min_price != null && svc.price < min_price) return false;
    if (max_price != null && svc.price > max_price) return false;
    if (availability_date && !isAvailableMatch(svc, availability_date)) return false;
    if (max_distance != null && userLoc) {
      const d = haversineDistanceMiles(userLoc, svc.location);
      if (d > max_distance) return false;
    }
    return true;
  });

  if (sort_by) {
    if (sort_by === 'distance' && userLoc) {
      result = result.sort((a, b) => haversineDistanceMiles(userLoc, a.location) - haversineDistanceMiles(userLoc, b.location));
    } else if (sort_by === 'price') {
      result = result.sort((a, b) => a.price - b.price);
    } else if (sort_by === 'rating') {
      result = result.sort((a, b) => b.rating - a.rating);
    } else if (sort_by === 'popularity') {
      result = result.sort((a, b) => b.total_bookings - a.total_bookings);
    }
  }

  return result;
}

export async function getServices(filters: ServiceFilters): Promise<Service[]> {
  // Simulate network latency
  await sleep(250);
  const userLoc = await getUserLocationSafe();
  return applyFilters(MOCK_SERVICES, filters, userLoc);
}

export async function getServiceById(id: string): Promise<Service> {
  await sleep(150);
  const svc = MOCK_SERVICES.find((s) => s.id === id);
  if (!svc) {
    throw new Error('Service not found');
  }
  return svc;
}

export async function searchServices(query: string): Promise<Service[]> {
  await sleep(200);
  const userLoc = await getUserLocationSafe();
  const pre = MOCK_SERVICES.filter((svc) => matchesQuery(svc, query));
  // Maintain a reasonable default sort (by relevance: rating then popularity, distance if available)
  const sorted = pre.sort((a, b) => {
    // Composite score
    const ratingDelta = b.rating - a.rating;
    if (Math.abs(ratingDelta) > 0.01) return ratingDelta;
    const popDelta = b.total_bookings - a.total_bookings;
    if (popDelta !== 0) return popDelta;
    if (userLoc) {
      return haversineDistanceMiles(userLoc, a.location) - haversineDistanceMiles(userLoc, b.location);
    }
    return 0;
  });
  return sorted;
}
>>>>>>> origin/main
>>>>>>> origin/main
