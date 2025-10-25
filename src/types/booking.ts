export type ServiceType = 'grooming' | 'walking' | 'vet_care' | 'training';

export interface ProviderProfile {
  id: string;
  name: string;
  avatar_url: string;
  bio?: string;
  rating: number; // 0-5
  total_reviews: number;
  years_of_experience?: number;
  verified?: boolean;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

export interface TimeSlot {
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  is_available: boolean;
}

export interface Service {
  id: string;
  provider_id: string;
  provider: ProviderProfile;
  title: string;
  description: string;
  service_type: ServiceType;
  price: number;
  duration: number; // minutes
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  images: string[];
  rating: number;
  total_bookings: number;
  availability_slots: TimeSlot[];
  created_at: string;
}

export interface ServiceFilters {
  service_type?: string;
  min_price?: number;
  max_price?: number;
  max_distance?: number; // miles
  availability_date?: string; // YYYY-MM-DD
  sort_by?: 'distance' | 'price' | 'rating' | 'popularity';
}
