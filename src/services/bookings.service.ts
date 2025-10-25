import { ProviderProfile, AvailabilitySlot, TimeSlot, BookingDetails } from '../types/booking.types';

// Mock Supabase client - replace with actual Supabase client in production
interface SupabaseClient {
  from: (table: string) => any;
}

// Initialize this with your actual Supabase client
let supabaseClient: SupabaseClient | null = null;

export const initializeSupabase = (client: SupabaseClient) => {
  supabaseClient = client;
};

/**
 * Fetch provider profile with all details
 */
export const getProviderProfile = async (providerId: string): Promise<ProviderProfile> => {
  try {
    // In production, replace with actual Supabase query
    // const { data, error } = await supabaseClient
    //   .from('providers')
    //   .select(`
    //     *,
    //     services(*),
    //     portfolio_items(*),
    //     reviews(*)
    //   `)
    //   .eq('id', providerId)
    //   .single();

    // Mock data for now
    const mockProfile: ProviderProfile = {
      id: providerId,
      full_name: 'Sarah Johnson',
      avatar_url: 'https://i.pravatar.cc/300',
      cover_photo_url: 'https://picsum.photos/400/200',
      bio: 'Professional pet groomer with 10+ years of experience. Specialized in breed-specific cuts and gentle handling techniques.',
      location: {
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94102',
        latitude: 37.7749,
        longitude: -122.4194,
      },
      rating: 4.8,
      total_reviews: 124,
      total_bookings: 450,
      service_types: ['Grooming', 'Bathing', 'Nail Trimming'],
      response_time: 'Usually responds within 1 hour',
      phone: '(415) 555-0123',
      email: 'sarah@example.com',
      services: [
        {
          id: '1',
          title: 'Full Grooming Service',
          description: 'Complete grooming package including bath, haircut, nail trim, and ear cleaning',
          duration: 120,
          price: 80,
          category: 'Grooming',
        },
        {
          id: '2',
          title: 'Bath & Brush',
          description: 'Relaxing bath with premium shampoo and thorough brushing',
          duration: 60,
          price: 40,
          category: 'Bathing',
        },
        {
          id: '3',
          title: 'Nail Trim & Paw Care',
          description: 'Professional nail trimming and paw pad treatment',
          duration: 30,
          price: 25,
          category: 'Nail Care',
        },
      ],
      business_hours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '10:00', close: '16:00' },
      },
      portfolio_items: [
        {
          id: '1',
          before_image_url: 'https://picsum.photos/300/300?random=1',
          after_image_url: 'https://picsum.photos/300/300?random=2',
          description: 'Golden Retriever - Full Grooming',
          created_at: '2024-03-15',
        },
        {
          id: '2',
          before_image_url: 'https://picsum.photos/300/300?random=3',
          after_image_url: 'https://picsum.photos/300/300?random=4',
          description: 'Poodle - Breed-Specific Cut',
          created_at: '2024-03-10',
        },
      ],
      reviews: [
        {
          id: '1',
          user_id: 'user1',
          user_name: 'John Doe',
          user_avatar: 'https://i.pravatar.cc/150?img=1',
          rating: 5,
          comment: 'Amazing service! My dog looks fantastic and was so comfortable throughout.',
          created_at: '2024-03-20',
        },
        {
          id: '2',
          user_id: 'user2',
          user_name: 'Jane Smith',
          user_avatar: 'https://i.pravatar.cc/150?img=2',
          rating: 5,
          comment: 'Very professional and gentle with my anxious pup. Highly recommend!',
          created_at: '2024-03-18',
        },
      ],
    };

    return mockProfile;
  } catch (error) {
    console.error('Error fetching provider profile:', error);
    throw error;
  }
};

/**
 * Get provider availability for a given month
 */
export const getProviderAvailability = async (
  providerId: string,
  month: string // Format: YYYY-MM
): Promise<AvailabilitySlot[]> => {
  try {
    // In production, query Supabase for bookings and calculate availability
    // const { data, error } = await supabaseClient
    //   .from('bookings')
    //   .select('date, start_time, end_time')
    //   .eq('provider_id', providerId)
    //   .gte('date', `${month}-01`)
    //   .lt('date', `${month}-32`);

    // Mock availability data
    const [year, monthNum] = month.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(monthNum), 0).getDate();
    const availability: AvailabilitySlot[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${month}-${day.toString().padStart(2, '0')}`;
      const dayOfWeek = new Date(date).getDay();
      
      // Provider doesn't work on Sundays
      const isAvailable = dayOfWeek !== 0;
      
      availability.push({
        date,
        available_slots: isAvailable ? Math.floor(Math.random() * 8) + 2 : 0,
        is_available: isAvailable,
      });
    }

    return availability;
  } catch (error) {
    console.error('Error fetching provider availability:', error);
    throw error;
  }
};

/**
 * Get available time slots for a specific date
 */
export const getTimeSlots = async (
  providerId: string,
  date: string,
  duration: number // service duration in minutes
): Promise<TimeSlot[]> => {
  try {
    // In production, fetch business hours and existing bookings from Supabase
    // const { data: businessHours } = await supabaseClient
    //   .from('providers')
    //   .select('business_hours')
    //   .eq('id', providerId)
    //   .single();

    // const { data: bookings } = await supabaseClient
    //   .from('bookings')
    //   .select('start_time, end_time')
    //   .eq('provider_id', providerId)
    //   .eq('date', date);

    // Mock business hours (9 AM - 6 PM)
    const startHour = 9;
    const endHour = 18;
    const dayOfWeek = new Date(date).getDay();

    // Check if date is Sunday (closed)
    if (dayOfWeek === 0) {
      return [];
    }

    // Saturday has different hours (10 AM - 4 PM)
    const adjustedStartHour = dayOfWeek === 6 ? 10 : startHour;
    const adjustedEndHour = dayOfWeek === 6 ? 16 : endHour;

    // Generate 30-minute time slots
    const slots: TimeSlot[] = [];
    const slotInterval = 30; // minutes
    
    for (let hour = adjustedStartHour; hour < adjustedEndHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotInterval) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Calculate end time based on service duration
        const totalMinutes = hour * 60 + minute + duration;
        const endHour = Math.floor(totalMinutes / 60);
        const endMinute = totalMinutes % 60;
        
        // Don't include slots that would extend past business hours
        if (endHour > adjustedEndHour) break;
        
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        // Randomly mark some slots as unavailable (simulating existing bookings)
        const isAvailable = Math.random() > 0.3;
        
        slots.push({
          start_time: `${date}T${startTime}:00`,
          end_time: `${date}T${endTime}:00`,
          is_available: isAvailable,
        });
      }
    }

    return slots;
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw error;
  }
};

/**
 * Check if a specific time slot is available
 */
export const checkSlotAvailability = async (
  providerId: string,
  startTime: string,
  duration: number
): Promise<boolean> => {
  try {
    // In production, check for conflicting bookings in Supabase
    // const endTime = new Date(new Date(startTime).getTime() + duration * 60000).toISOString();
    // const { data, error } = await supabaseClient
    //   .from('bookings')
    //   .select('id')
    //   .eq('provider_id', providerId)
    //   .or(`start_time.lte.${endTime},end_time.gte.${startTime}`)
    //   .limit(1);

    // Mock: randomly return availability
    return Math.random() > 0.2;
  } catch (error) {
    console.error('Error checking slot availability:', error);
    throw error;
  }
};

/**
 * Create a booking
 */
export const createBooking = async (bookingDetails: BookingDetails): Promise<{ id: string }> => {
  try {
    // In production, insert booking into Supabase
    // const { data, error } = await supabaseClient
    //   .from('bookings')
    //   .insert([bookingDetails])
    //   .select()
    //   .single();

    // Mock response
    return { id: Math.random().toString(36).substring(7) };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Parse time string to minutes
 */
export const parseTimeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Format minutes to time string
 */
export const formatMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};
