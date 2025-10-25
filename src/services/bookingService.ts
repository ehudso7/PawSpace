import { supabase } from '../lib/supabase';
import { AvailabilitySlot, TimeSlot, BookingRequest } from '../types/booking';

export class BookingService {
  /**
   * Get provider availability for a specific month
   */
  static async getProviderAvailability(
    providerId: string, 
    month: string
  ): Promise<AvailabilitySlot[]> {
    try {
      const { data, error } = await supabase
        .from('provider_availability')
        .select('*')
        .eq('provider_id', providerId)
        .gte('date', `${month}-01`)
        .lt('date', `${month}-32`)
        .order('date');

      if (error) throw error;

      // Transform data to AvailabilitySlot format
      const availability: AvailabilitySlot[] = data?.map(item => ({
        date: item.date,
        available_slots: item.available_slots || 0,
        is_available: item.is_available && item.available_slots > 0
      })) || [];

      return availability;
    } catch (error) {
      console.error('Error fetching provider availability:', error);
      return [];
    }
  }

  /**
   * Get available time slots for a specific date and service duration
   */
  static async getTimeSlots(
    providerId: string, 
    date: string, 
    duration: number
  ): Promise<TimeSlot[]> {
    try {
      // Get provider's business hours for the day of week
      const dayOfWeek = new Date(date).toLocaleLowerCase();
      const { data: providerData } = await supabase
        .from('providers')
        .select('business_hours')
        .eq('id', providerId)
        .single();

      if (!providerData?.business_hours) {
        return [];
      }

      const businessHours = providerData.business_hours[dayOfWeek];
      if (!businessHours) {
        return [];
      }

      // Get existing bookings for the date
      const { data: bookings } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('provider_id', providerId)
        .eq('date', date)
        .eq('status', 'confirmed');

      // Generate time slots
      const slots: TimeSlot[] = [];
      const startTime = new Date(`${date}T${businessHours.open}`);
      const endTime = new Date(`${date}T${businessHours.close}`);
      const slotDuration = 30; // 30-minute intervals

      for (let time = new Date(startTime); time < endTime; time.setMinutes(time.getMinutes() + slotDuration)) {
        const slotEndTime = new Date(time.getTime() + duration * 60000);
        
        // Check if slot extends beyond business hours
        if (slotEndTime > endTime) break;

        // Check for conflicts with existing bookings
        const isAvailable = !this.hasBookingConflict(
          time.toISOString().slice(11, 16),
          slotEndTime.toISOString().slice(11, 16),
          bookings || []
        );

        slots.push({
          start_time: time.toISOString().slice(11, 16),
          end_time: slotEndTime.toISOString().slice(11, 16),
          is_available: isAvailable
        });
      }

      return slots;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      return [];
    }
  }

  /**
   * Check if a time slot is available
   */
  static async checkSlotAvailability(
    providerId: string, 
    startTime: string, 
    duration: number
  ): Promise<boolean> {
    try {
      const date = startTime.split('T')[0];
      const time = startTime.split('T')[1].slice(0, 5);
      const endTime = new Date(new Date(startTime).getTime() + duration * 60000)
        .toISOString().slice(11, 16);

      const { data: bookings } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('provider_id', providerId)
        .eq('date', date)
        .eq('status', 'confirmed');

      return !this.hasBookingConflict(time, endTime, bookings || []);
    } catch (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }
  }

  /**
   * Create a new booking
   */
  static async createBooking(booking: BookingRequest): Promise<{ success: boolean; bookingId?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          provider_id: booking.provider_id,
          service_id: booking.service_id,
          date: booking.date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          notes: booking.notes,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      return { success: true, bookingId: data.id };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Helper function to check for booking conflicts
   */
  private static hasBookingConflict(
    startTime: string, 
    endTime: string, 
    existingBookings: Array<{ start_time: string; end_time: string }>
  ): boolean {
    return existingBookings.some(booking => {
      const bookingStart = booking.start_time;
      const bookingEnd = booking.end_time;
      
      // Check if the new slot overlaps with any existing booking
      return (startTime < bookingEnd && endTime > bookingStart);
    });
  }
}