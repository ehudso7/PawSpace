export interface Location {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
}

export interface TransformationItem {
  id: string;
  before_image_url: string;
  after_image_url: string;
  description: string;
  service_type: string;
}

export interface BusinessHours {
  monday?: { open: string; close: string; };
  tuesday?: { open: string; close: string; };
  wednesday?: { open: string; close: string; };
  thursday?: { open: string; close: string; };
  friday?: { open: string; close: string; };
  saturday?: { open: string; close: string; };
  sunday?: { open: string; close: string; };
}

export interface Review {
  id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  service_type?: string;
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
  reviews: Review[];
  service_types: string[];
}

export interface AvailabilitySlot {
  date: string;
  available_slots: number;
  is_available: boolean;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface BookingDetails {
  provider_id: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface CalendarMarking {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    disabled?: boolean;
    disableTouchEvent?: boolean;
    selectedColor?: string;
    selectedTextColor?: string;
  };
}