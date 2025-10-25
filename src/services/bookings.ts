import { apiGet, apiPost, apiPatch, apiDelete } from './apiClient';
import type { Booking, CreateBookingData } from '../types';

export async function createBooking(data: CreateBookingData): Promise<Booking> {
  return await apiPost<Booking>('/bookings', data);
}

export async function getMyBookings(status?: 'upcoming' | 'past' | 'cancelled'): Promise<Booking[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return await apiGet<Booking[]>(`/bookings/mine${query}`);
}

export async function getBookingById(id: string): Promise<Booking> {
  return await apiGet<Booking>(`/bookings/${encodeURIComponent(id)}`);
}

export async function cancelBooking(id: string, reason: string): Promise<void> {
  await apiPost(`/bookings/${encodeURIComponent(id)}/cancel`, { reason });
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
  await apiPatch(`/bookings/${encodeURIComponent(id)}`, { status });
}
