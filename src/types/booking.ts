export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface ProviderProfile {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  total_reviews: number;
  verified: boolean;
  bio?: string;
  phone?: string;
  email?: string;
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
  distance?: number; // calculated distance from user
}

export interface ServiceFilters {
  service_type?: string;
  min_price?: number;
  max_price?: number;
  max_distance?: number;
  availability_date?: string;
  sort_by?: 'distance' | 'price' | 'rating' | 'popularity';
  search_query?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    has_more: boolean;
  };
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export type ServiceType = 'all' | 'grooming' | 'walking' | 'vet_care' | 'training';
export type SortOption = 'distance' | 'price' | 'rating' | 'popularity';
export type AvailabilityFilter = 'anytime' | 'today' | 'this_week';