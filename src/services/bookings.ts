import { http } from '../utils/http';
import type { Booking, BookingStatus, CreateBookingData } from '../types';

export async function createBooking(bookingData: CreateBookingData & { payment_intent_id?: string }): Promise<Booking> {
  return http<Booking>('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

export async function getMyBookings(status?: 'upcoming' | 'past' | 'cancelled'): Promise<Booking[]> {
  const path = status ? `/bookings?status=${encodeURIComponent(status)}` : '/bookings';
  return http<Booking[]>(path);
}

export async function getBookingById(id: string): Promise<Booking> {
  return http<Booking>(`/bookings/${encodeURIComponent(id)}`);
}

export async function cancelBooking(id: string, reason: string): Promise<void> {
  await http<void>(`/bookings/${encodeURIComponent(id)}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  await http<void>(`/bookings/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
