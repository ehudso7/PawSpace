export type Booking = {
  id: string;
  serviceId: string;
  providerId: string;
  userId: string;
  startTime: string; // ISO
  endTime: string; // ISO
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
};

export async function fetchMyBookings(userId: string): Promise<Booking[]> {
  // Placeholder
  return [];
}

export async function createBooking(partial: Omit<Booking, 'id' | 'status'>): Promise<Booking> {
  // Placeholder
  return { id: 'new', status: 'pending', ...partial } as Booking;
}
