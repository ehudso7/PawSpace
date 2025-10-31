import {
  Booking,
  CreateBookingData,
  BookingStatus,
  Pet,
  Service,
  ProviderProfile,
} from '../types/booking';

import { getApiUrl } from '../config/appConfig';

class BookingService {
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<any> {
    try {
      const response = await fetch(getApiUrl(endpoint), {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header here
          // 'Authorization': `Bearer ${await getAuthToken()}`,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    try {
      const data = await this.makeRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });

      return data.booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  }

  async getMyBookings(
    status?: 'upcoming' | 'past' | 'cancelled',
  ): Promise<Booking[]> {
    try {
      const queryParams = status ? `?status=${status}` : '';
      const data = await this.makeRequest(`/bookings/my${queryParams}`);

      return data.bookings || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  async getBookingById(id: string): Promise<Booking> {
    try {
      const data = await this.makeRequest(`/bookings/${id}`);
      return data.booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw new Error('Failed to fetch booking details');
    }
  }

  async cancelBooking(id: string, reason: string): Promise<void> {
    try {
      await this.makeRequest(`/bookings/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({reason}),
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error('Failed to cancel booking');
    }
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
    try {
      await this.makeRequest(`/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({status}),
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status');
    }
  }

  async getUserPets(): Promise<Pet[]> {
    try {
      const data = await this.makeRequest('/pets/my');
      return data.pets || [];
    } catch (error) {
      console.error('Error fetching pets:', error);
      throw new Error('Failed to fetch pets');
    }
  }

  async getService(serviceId: string): Promise<Service> {
    try {
      const data = await this.makeRequest(`/services/${serviceId}`);
      return data.service;
    } catch (error) {
      console.error('Error fetching service:', error);
      throw new Error('Failed to fetch service details');
    }
  }

  async getProvider(providerId: string): Promise<ProviderProfile> {
    try {
      const data = await this.makeRequest(`/providers/${providerId}`);
      return data.provider;
    } catch (error) {
      console.error('Error fetching provider:', error);
      throw new Error('Failed to fetch provider details');
    }
  }

  // Utility methods
  calculatePlatformFee(servicePrice: number): number {
    return Math.round(servicePrice * 0.1 * 100) / 100; // 10% platform fee
  }

  calculateTotalPrice(servicePrice: number): number {
    const platformFee = this.calculatePlatformFee(servicePrice);
    return servicePrice + platformFee;
  }

  formatBookingTime(appointmentTime: string): string {
    const date = new Date(appointmentTime);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} min`;
    } else if (remainingMinutes === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${remainingMinutes} min`;
    }
  }

  getBookingStatusColor(status: BookingStatus): string {
    switch (status) {
      case 'pending':
        return '#FFA500'; // Orange
      case 'confirmed':
        return '#4CAF50'; // Green
      case 'completed':
        return '#2196F3'; // Blue
      case 'cancelled':
        return '#F44336'; // Red
      default:
        return '#757575'; // Gray
    }
  }

  getBookingStatusText(status: BookingStatus): string {
    switch (status) {
      case 'pending':
        return 'Pending Confirmation';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  canCancelBooking(booking: Booking): boolean {
    const now = new Date();
    const appointmentTime = new Date(booking.appointment_time);
    const hoursUntilAppointment = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Can cancel if booking is confirmed and appointment is more than 24 hours away
    return booking.status === 'confirmed' && hoursUntilAppointment > 24;
  }

  canLeaveReview(booking: Booking): boolean {
    return booking.status === 'completed';
  }

  sortBookingsByDate(bookings: Booking[], ascending: boolean = true): Booking[] {
    return [...bookings].sort((a, b) => {
      const dateA = new Date(a.appointment_time).getTime();
      const dateB = new Date(b.appointment_time).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  filterBookingsByStatus(bookings: Booking[], status: 'upcoming' | 'past' | 'cancelled'): Booking[] {
    const now = new Date();

    switch (status) {
      case 'upcoming':
        return bookings.filter(booking => {
          const appointmentTime = new Date(booking.appointment_time);
          return (booking.status === 'confirmed' || booking.status === 'pending') && 
                 appointmentTime > now;
        });
      case 'past':
        return bookings.filter(booking => {
          const appointmentTime = new Date(booking.appointment_time);
          return booking.status === 'completed' || 
                 (booking.status === 'confirmed' && appointmentTime < now);
        });
      case 'cancelled':
        return bookings.filter(booking => booking.status === 'cancelled');
      default:
        return bookings;
    }
  }
}

export default new BookingService();
