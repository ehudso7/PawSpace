import { useEffect, useState } from 'react';

export type Booking = {
  id: string;
};

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings([]);
  }, []);

  return { bookings };
}
