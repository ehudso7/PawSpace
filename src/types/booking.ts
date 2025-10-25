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

// PR #28 Booking and Payment Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  age?: number;
  weight?: number;
  special_instructions?: string;
  medical_conditions?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  service_id: string;
  service: Service;
  provider_id: string;
  provider: ProviderProfile;
  client_id: string;
  client: UserProfile;
  pet_id?: string;
  pet?: Pet;
  appointment_time: string;
  duration: number;
  status: BookingStatus;
  notes?: string;
  total_price: number;
  platform_fee: number;
  payment_intent_id: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingData {
  service_id: string;
  appointment_time: string;
  pet_id?: string;
  notes?: string;
  payment_method_id: string;
}

export interface BookingData {
  service: Service;
  provider: ProviderProfile;
  appointment_time: string;
  duration: number;
  pet_id?: string;
  notes?: string;
  total_price: number;
  platform_fee: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  is_default: boolean;
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentResult {
  error?: {
    code: string;
    message: string;
  };
  paymentIntent?: {
    id: string;
    status: string;
  };
}