export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  type: string;
  price: number; // base service price in cents
  duration: number; // minutes
  location_address?: string;
}

export interface ProviderProfile {
  id: string;
  name: string;
  avatar_url?: string;
  rating?: number; // 0-5
}

export interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface Pet {
  id: string;
  name: string;
  species?: string;
  breed?: string;
}

export interface Booking {
  id: string;
  service_id: string;
  service: Service;
  provider_id: string;
  provider: ProviderProfile;
  client_id: string;
  client: UserProfile;
  pet_id?: string;
  appointment_time: string;
  duration: number;
  status: BookingStatus;
  notes?: string;
  total_price: number; // cents
  platform_fee: number; // cents
  payment_intent_id: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingData {
  service_id: string;
  appointment_time: string; // ISO string
  pet_id?: string;
  notes?: string;
  payment_method_id: string; // As per spec
}

// Stripe related types used by our service wrappers
export interface StripePaymentIntentData {
  id: string;
  clientSecret: string;
  customerId?: string;
  customerEphemeralKeySecret?: string;
  amount: number; // cents
  currency: string;
}

export interface PaymentResult {
  status: 'succeeded' | 'processing' | 'requires_action' | 'canceled' | 'failed';
  paymentIntentId?: string;
  paymentMethodId?: string;
  errorMessage?: string;
}
