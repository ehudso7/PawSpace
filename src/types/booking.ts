export interface Service {
  id: string;
  provider_id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  price_cents: number;
  currency: string; // e.g., 'USD'
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string; // IANA timezone, e.g., 'America/Los_Angeles'
}

export interface TransformationItem {
  id: string;
  before_photo_url?: string;
  after_photo_url?: string;
  caption?: string;
}

export interface Review {
  id: string;
  rating: number; // 1-5
  comment?: string;
  created_at: string; // ISO
  reviewer_name?: string;
  reviewer_avatar_url?: string;
}

export interface BusinessHoursDay {
  open: string; // 'HH:mm' 24h in provider timezone
  close: string; // 'HH:mm'
}

export interface BusinessHours {
  monday?: BusinessHoursDay;
  tuesday?: BusinessHoursDay;
  wednesday?: BusinessHoursDay;
  thursday?: BusinessHoursDay;
  friday?: BusinessHoursDay;
  saturday?: BusinessHoursDay;
  sunday?: BusinessHoursDay;
  timezone?: string; // IANA timezone
}

export interface ProviderProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  cover_photo_url?: string;
  bio: string;
  location: Location;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  services: Service[];
  business_hours: BusinessHours;
  portfolio_items: TransformationItem[];
  contact_phone?: string;
  contact_email?: string;
  reviews?: Review[];
}

export interface AvailabilitySlot {
  date: string; // 'YYYY-MM-DD' in provider timezone
  available_slots: number;
  is_available: boolean;
}

export interface TimeSlot {
  start_time: string; // ISO UTC
  end_time: string; // ISO UTC
  is_available: boolean;
}

export type DayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface BookingServiceSummary {
  service: Service;
  date?: string; // YYYY-MM-DD in provider TZ
  start_time_iso?: string; // UTC ISO
  end_time_iso?: string; // UTC ISO
}
