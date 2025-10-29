export interface Location {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransformationItem {
  id: string;
  before_image_url: string;
  after_image_url: string;
  description?: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  images?: string[];
}

export interface BusinessHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export interface ProviderProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  avatar_url?: string;
  coverImage?: string;
  location: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  createdAt: string;
  updatedAt: string;
  total_bookings: number;
  services: Service[];
  business_hours: BusinessHours;
  portfolio_items: TransformationItem[];
  reviews?: Review[];
  service_types: string[]; // e.g., ["Grooming", "Training", "Walking"]
  response_time?: string; // e.g., "Usually responds within 1 hour"
  phone?: string;
  email?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySlot {
  date: string; // YYYY-MM-DD format
  available_slots: number;
  is_available: boolean;
}

export interface TimeSlot {
  start_time: string; // ISO string or time format
  end_time: string; // ISO string or time format
  is_available: boolean;
}

export interface BookingDetails {
  provider_id: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
  service_title: string;
  service_duration: number;
  service_price: number;
}

export interface BookingData {
  service: Service;
  provider: ProviderProfile;
  pet: Pet;
  date: string;
  time: string;
  location: Location;
  notes?: string;
}

export interface CreateBookingData {
  serviceId: string;
  providerId: string;
  petId: string;
  date: string;
  time: string;
  location: Location;
  notes?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntent?: string;
  error?: string;
}
