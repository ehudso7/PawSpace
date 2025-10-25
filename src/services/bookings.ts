import { Booking, CreateBookingData, BookingStatus, CancellationData } from '../types/booking';
import { ErrorHandler } from '../utils/errorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = async (): Promise<string> => {
  // Implement your auth token retrieval logic here
  return 'your-auth-token';
};

// Create a new booking
export const createBooking = async (bookingData: CreateBookingData): Promise<Booking> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP ${response.status}: Failed to create booking`);
      (error as any).code = errorData.code;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw ErrorHandler.handle(error);
  }
};

// Get user's bookings with optional status filter
export const getMyBookings = async (
  status?: 'upcoming' | 'past' | 'cancelled'
): Promise<Booking[]> => {
  try {
    const params = new URLSearchParams();
    if (status) {
      params.append('status', status);
    }

    const response = await fetch(`${API_BASE_URL}/bookings/my?${params}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (id: string): Promise<Booking> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (id: string, reason: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to cancel booking');
    }
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Update booking status (admin/provider only)
export const updateBookingStatus = async (
  id: string,
  status: BookingStatus
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update booking status');
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

// Get booking availability for a service
export const getBookingAvailability = async (
  serviceId: string,
  date: string
): Promise<string[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bookings/availability?service_id=${serviceId}&date=${date}`,
      {
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch availability');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }
};

// Reschedule a booking
export const rescheduleBooking = async (
  id: string,
  newAppointmentTime: string
): Promise<Booking> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/reschedule`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({ appointment_time: newAppointmentTime }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reschedule booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    throw error;
  }
};

// Get cancellation reasons
export const getCancellationReasons = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/cancellation-reasons`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cancellation reasons');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cancellation reasons:', error);
    throw error;
  }
};

// Calculate refund amount for cancellation
export const calculateRefundAmount = async (
  bookingId: string
): Promise<{ refund_amount: number; can_refund: boolean }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/refund-calculation`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to calculate refund amount');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calculating refund amount:', error);
    throw error;
  }
};