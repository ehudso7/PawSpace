// Minimal central types barrel for app runtime
export * from './navigation';
export * from './database';

// Minimal common app-level types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthError {
  message: string;
}
