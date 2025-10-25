export type ServiceType = 'grooming' | 'walking' | 'vet_care' | 'training';

export interface TimeSlot {
  start: string; // ISO datetime
  end: string; // ISO datetime
  isAvailable: boolean;
}

export interface GeoLocation {
  address: string;
  latitude: number;
  longitude: number;
}

export interface ProviderProfile {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number; // 0-5 average rating
  totalReviews: number;
  location: GeoLocation;
  bio?: string;
  specialties?: ServiceType[];
}

export interface Service {
  id: string;
  provider_id: string;
  provider: ProviderProfile;
  title: string;
  description: string;
  service_type: ServiceType;
  price: number; // USD
  duration: number; // minutes
  location: GeoLocation;
  images: string[];
  rating: number; // 0-5 average rating for the service
  total_bookings: number;
  availability_slots: TimeSlot[];
  created_at: string; // ISO datetime
}

export type SortBy = 'distance' | 'price' | 'rating' | 'popularity';

export interface ServiceFilters {
  service_type?: string;
  min_price?: number;
  max_price?: number;
  max_distance?: number; // miles
  availability_date?: string; // ISO date (yyyy-mm-dd)
  sort_by?: SortBy;
}
