<<<<<<< HEAD
// Re-export all types
export * from './navigation';
export * from './database';

// Common types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Provider extends User {
  bio: string;
  rating: number;
  reviewCount: number;
  services: Service[];
}

export interface Service {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Transformation {
  id: string;
  userId: string;
  beforeImage: string;
  afterImage: string;
  description?: string;
  likes: number;
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
=======
export * from './database';
export * from './navigation';
>>>>>>> origin/main
