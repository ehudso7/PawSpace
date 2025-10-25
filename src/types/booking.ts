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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
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

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  duration: number;
  provider_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  business_name: string;
  avatar?: string;
  rating: number;
  review_count: number;
  location: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
  breed?: string;
  age?: number;
  weight?: number;
  special_notes?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentResult {
  success: boolean;
  payment_intent_id?: string;
  error?: string;
}

export interface CancellationData {
  booking_id: string;
  reason: string;
  refund_amount?: number;
}