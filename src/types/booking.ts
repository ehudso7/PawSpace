export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  type: string;
  base_price: number; // in major currency units
  currency: string; // e.g., "USD"
}

export interface ProviderProfile {
  id: string;
  name: string;
  avatar_url?: string;
  rating?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
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
  appointment_time: string; // ISO string
  duration: number; // minutes
  status: BookingStatus;
  notes?: string;
  total_price: number; // major currency units
  platform_fee: number; // major currency units
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
  payment_method_id: string; // often derived on backend from payment intent
}

export interface CreateBookingPayload extends Omit<CreateBookingData, 'payment_method_id'> {
  payment_method_id?: string;
  payment_intent_id?: string;
}

export interface BookingSummaryPrice {
  servicePrice: number; // major units
  platformFee: number; // major units
  total: number; // major units
}

export interface PetSummary {
  id: string;
  name: string;
  breed?: string;
  avatar_url?: string;
}

export interface BookingConfirmParams {
  service: Service;
  provider: ProviderProfile;
  dateTime: string; // ISO string
  duration: number; // minutes
  location: string;
  basePrice: number; // major currency units
  currency?: string; // defaults to service.currency
  pets?: PetSummary[];
}
