// User Types
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
  tags: string[];
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransformationData {
  imageUrl: string;
  beforeImageUrl?: string;
  caption: string;
  tags: string[];
}

export interface TransformationComment {
  id: string;
  transformationId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
}

// Provider Types
export interface Provider {
  id: string;
  userId: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  coverImage?: string;
  location: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  isVerified: boolean;
  services: Service[];
  availability: Availability[];
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  providerId: string;
  provider?: Provider;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: number; // in minutes
  imageUrl: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 
  | 'grooming'
  | 'training'
  | 'veterinary'
  | 'boarding'
  | 'walking'
  | 'sitting'
  | 'photography'
  | 'other';

export interface Availability {
  id: string;
  providerId: string;
  dayOfWeek: number; // 0-6, Sunday = 0
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isActive: boolean;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  user?: User;
  serviceId: string;
  service: Service;
  providerId: string;
  provider: Provider;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  notes?: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

// Review Types
export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  user: User;
  providerId: string;
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// Pet Types
export interface Pet {
  id: string;
  userId: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  age?: number;
  weight?: number;
  color?: string;
  avatar?: string;
  medicalNotes?: string;
  behaviorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionPlan = 'free' | 'premium' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due';

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'booking_confirmed'
  | 'booking_reminder'
  | 'booking_cancelled'
  | 'new_message'
  | 'transformation_liked'
  | 'new_follower'
  | 'payment_received'
  | 'review_received';

// Chat/Message Types
export interface ChatRoom {
  id: string;
  participants: string[]; // User IDs
  lastMessage?: Message;
  updatedAt: string;
  createdAt: string;
}

export interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  sender: User;
  content: string;
  messageType: MessageType;
  isRead: boolean;
  createdAt: string;
}

export type MessageType = 'text' | 'image' | 'booking_request' | 'system';

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
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
  phone?: string;
}

export interface ProfileForm {
  name: string;
  bio?: string;
  location?: string;
  phone?: string;
}

// Filter Types
export interface ServiceFilters {
  category?: ServiceCategory;
  location?: string;
  priceRange?: [number, number];
  rating?: number;
  availability?: string; // date string
}

export interface TransformationFilters {
  tags?: string[];
  userId?: string;
  dateRange?: [string, string];
}