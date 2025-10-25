export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface ProviderProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  rating: number;
  review_count: number;
  bio?: string;
  location: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  provider_id: string;
  name: string;
  description: string;
  type: 'grooming' | 'walking' | 'sitting' | 'training' | 'veterinary' | 'boarding';
  price: number;
  duration: number; // in minutes
  location: string;
  available_days: string[];
  available_hours: {
    start: string;
    end: string;
  };
  images?: string[];
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