import { AvailabilitySlot, TimeSlot, ProviderProfile, BookingDetails } from '../types/booking';

// Mock Supabase client - replace with actual Supabase client
const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        gte: (column: string, value: any) => ({
          lte: (column: string, value: any) => Promise.resolve({ data: [], error: null })
        }),
        single: () => Promise.resolve({ data: null, error: null })
      }),
      order: (column: string, options?: any) => Promise.resolve({ data: [], error: null })
    }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
    })
  })
};

export class BookingService {
  /**
   * Get provider's availability for a specific month
   */
  static async getProviderAvailability(
    providerId: string, 
    month: string
  ): Promise<AvailabilitySlot[]> {
    try {
      // Parse month (format: YYYY-MM)
      const [year, monthNum] = month.split('-');
      const startDate = `${year}-${monthNum}-01`;
      const endDate = `${year}-${monthNum}-31`;

      // Fetch provider's schedule and existing bookings
      const { data: schedule, error: scheduleError } = await supabase
        .from('provider_schedules')
        .select('*')
        .eq('provider_id', providerId);

      if (scheduleError) throw scheduleError;

      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('date, start_time, end_time, duration')
        .eq('provider_id', providerId)
        .gte('date', startDate)
        .lte('date', endDate);

      if (bookingsError) throw bookingsError;

      // Generate availability slots for each day of the month
      const availabilitySlots: AvailabilitySlot[] = [];
      const daysInMonth = new Date(parseInt(year), parseInt(monthNum), 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${monthNum.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dayOfWeek = new Date(date).toLocaleLowerCase().substring(0, 3);
        
        // Check if provider works on this day
        const daySchedule = schedule?.find((s: any) => s.day_of_week === dayOfWeek);
        
        if (!daySchedule || !daySchedule.is_available) {
          availabilitySlots.push({
            date,
            available_slots: 0,
            is_available: false
          });
          continue;
        }

        // Calculate available slots based on business hours and existing bookings
        const dayBookings = bookings?.filter((b: any) => b.date === date) || [];
        const totalSlots = this.calculateTotalSlots(daySchedule.start_time, daySchedule.end_time);
        const bookedSlots = dayBookings.length;
        const availableSlots = Math.max(0, totalSlots - bookedSlots);

        availabilitySlots.push({
          date,
          available_slots: availableSlots,
          is_available: availableSlots > 0 && new Date(date) >= new Date()
        });
      }

      return availabilitySlots;
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
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      // Get provider's schedule for this day
      const { data: schedule, error: scheduleError } = await supabase
        .from('provider_schedules')
        .select('*')
        .eq('provider_id', providerId)
        .eq('day_of_week', dayOfWeek)
        .single();

      if (scheduleError || !schedule?.is_available) {
        return [];
      }

      // Get existing bookings for this date
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('provider_id', providerId)
        .eq('date', date);

      if (bookingsError) throw bookingsError;

      // Generate time slots
      const timeSlots: TimeSlot[] = [];
      const startTime = this.parseTime(schedule.start_time);
      const endTime = this.parseTime(schedule.end_time);
      const slotDuration = 30; // 30-minute intervals

      let currentTime = startTime;
      while (currentTime + duration <= endTime) {
        const slotStart = this.formatTime(currentTime);
        const slotEnd = this.formatTime(currentTime + duration);

        // Check if this slot conflicts with existing bookings
        const isAvailable = !this.hasConflict(slotStart, slotEnd, bookings || []);

        timeSlots.push({
          start_time: slotStart,
          end_time: slotEnd,
          is_available: isAvailable
        });

        currentTime += slotDuration;
      }

      return timeSlots;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      return [];
    }
  }

  /**
   * Check if a specific time slot is available
   */
  static async checkSlotAvailability(
    providerId: string, 
    startTime: string, 
    duration: number
  ): Promise<boolean> {
    try {
      const date = startTime.split('T')[0];
      const time = startTime.split('T')[1];
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('provider_id', providerId)
        .eq('date', date);

      if (error) throw error;

      const endTime = this.addMinutesToTime(time, duration);
      return !this.hasConflict(time, endTime, bookings || []);
    } catch (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }
  }

  /**
   * Get provider profile with all details
   */
  static async getProviderProfile(providerId: string): Promise<ProviderProfile | null> {
    try {
      const { data: provider, error: providerError } = await supabase
        .from('providers')
        .select(`
          *,
          services (*),
          portfolio_items (*),
          reviews (*, user:users(*))
        `)
        .eq('id', providerId)
        .single();

      if (providerError) throw providerError;

      // Get business hours
      const { data: businessHours, error: hoursError } = await supabase
        .from('provider_schedules')
        .select('*')
        .eq('provider_id', providerId);

      if (hoursError) throw hoursError;

      // Format business hours
      const formattedHours: any = {};
      businessHours?.forEach((schedule: any) => {
        if (schedule.is_available) {
          formattedHours[schedule.day_of_week] = {
            open: schedule.start_time,
            close: schedule.end_time
          };
        }
      });

      return {
        ...provider,
        business_hours: formattedHours,
        service_types: [...new Set(provider.services?.map((s: any) => s.category) || [])]
      };
    } catch (error) {
      console.error('Error fetching provider profile:', error);
      return null;
    }
  }

  /**
   * Create a new booking
   */
  static async createBooking(bookingDetails: BookingDetails): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          provider_id: bookingDetails.provider_id,
          service_id: bookingDetails.service_id,
          date: bookingDetails.date,
          start_time: bookingDetails.start_time,
          end_time: bookingDetails.end_time,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating booking:', error);
      return false;
    }
  }

  // Helper methods
  private static calculateTotalSlots(startTime: string, endTime: string): number {
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);
    return Math.floor((end - start) / 30); // 30-minute slots
  }

  private static parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private static formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private static addMinutesToTime(time: string, minutes: number): string {
    const timeInMinutes = this.parseTime(time);
    return this.formatTime(timeInMinutes + minutes);
  }

  private static hasConflict(
    startTime: string, 
    endTime: string, 
    existingBookings: any[]
  ): boolean {
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);

    return existingBookings.some(booking => {
      const bookingStart = this.parseTime(booking.start_time);
      const bookingEnd = this.parseTime(booking.end_time);
      
      return (start < bookingEnd && end > bookingStart);
    });
  }
}