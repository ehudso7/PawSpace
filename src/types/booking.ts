export interface ProviderProfile {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  total_reviews: number;
  verified: boolean;
  bio?: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface Service {
  id: string;
  provider_id: string;
  provider: ProviderProfile;
  title: string;
  description: string;
  service_type: 'grooming' | 'walking' | 'vet_care' | 'training';
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
  max_distance?: number;
  availability_date?: string;
  sort_by?: 'distance' | 'price' | 'rating' | 'popularity';
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  total_pages: number;
  total_items: number;
  has_more: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
}
