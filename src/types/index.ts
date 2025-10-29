// Re-export all types
export * from './navigation';
export * from './database';
export * from './booking.types';

// Common types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthError {
  message: string;
}

// Transformation Types
export interface Transformation {
  id: string;
  userId: string;
  user: User;
  imageUrl: string;
  beforeImageUrl?: string;
  caption: string;
  category: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransformationData {
  imageUrl: string;
  caption: string;
  category?: string;
}

// Publishing and Platform Types
export type Platform = 'pawspace' | 'instagram' | 'tiktok' | 'twitter';

export interface PublishingOptions {
  platforms: Platform[];
  schedule?: Date;
  caption?: string;
  hashtags?: string[];
}

// Video Player Types
export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
}

// Transition Types
export type TransitionType = 'fade' | 'slide' | 'zoom' | 'rotate' | 'none';

// Service Types
export interface Service {
  id: string;
  providerId: string;
  title: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  category: string;
  type: 'grooming' | 'walking' | 'sitting' | 'training' | 'veterinary' | 'boarding';
  isAvailable: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

// Provider Types
export interface Provider {
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
  services?: Service[];
  createdAt: string;
  updatedAt: string;
}

export interface ProviderProfile extends Provider {
  specialties: string[];
  experience: number;
  languages: string[];
  availability: string;
  portfolio: string[];
  certifications: string[];
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  providerId: string;
  service?: Service;
  provider?: Provider;
  date: string;
  time: string;
  appointment_time: string;
  status: BookingStatus;
  notes?: string;
  totalPrice: number;
  total_price: number;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface CreateBookingData {
  serviceId: string;
  providerId: string;
  date: string;
  time: string;
  notes?: string;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  providerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'message' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileForm {
  name: string;
  bio?: string;
  location?: string;
  phone?: string;
}

// Filter Types
export interface ServiceFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  rating?: number;
}

export interface ProviderFilters {
  location?: string;
  minRating?: number;
  services?: string[];
}

// Search Types
export interface SearchResult {
  type: 'service' | 'provider' | 'transformation';
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  rating?: number;
  price?: number;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;