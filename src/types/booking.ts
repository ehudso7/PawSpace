export interface Location {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export interface Service {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  priceCents: number;
  currency: string;
  category?: string;
}

export interface TransformationItem {
  id: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  caption?: string;
}

export interface BusinessDayWindow {
  open: string; // HH:mm in provider tz
  close: string; // HH:mm in provider tz
}

export interface BusinessHours {
  monday?: BusinessDayWindow;
  tuesday?: BusinessDayWindow;
  wednesday?: BusinessDayWindow;
  thursday?: BusinessDayWindow;
  friday?: BusinessDayWindow;
  saturday?: BusinessDayWindow;
  sunday?: BusinessDayWindow;
}

export interface ProviderProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  cover_photo_url?: string;
  bio: string;
  location: Location;
  email?: string;
  phone?: string;
  website?: string;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  services: Service[];
  business_hours: BusinessHours;
  portfolio_items: TransformationItem[];
  reviews?: Review[];
}

export interface AvailabilitySlot {
  date: string; // YYYY-MM-DD in provider tz
  available_slots: number;
  is_available: boolean;
}

export interface TimeSlot {
  start_time: string; // ISO string in provider tz
  end_time: string;   // ISO string in provider tz
  is_available: boolean;
}

export interface BookingServiceRecap {
  serviceId: string;
  serviceTitle: string;
  durationMinutes: number;
  priceCents: number;
  currency: string;
}

export interface Review {
  id: string;
  rating: number; // 1-5
  comment: string;
  created_at: string; // ISO
  reviewer_name?: string;
  reviewer_avatar_url?: string;
}
