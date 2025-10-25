// Placeholder types for Supabase tables
export type Tables = {
  profiles: {
    Row: {
      id: string;
      username: string | null;
      avatar_url: string | null;
      created_at: string;
    };
  };
  bookings: {
    Row: {
      id: string;
      user_id: string;
      provider_id: string;
      service_id: string;
      start_time: string;
      end_time: string;
      status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    };
  };
};
