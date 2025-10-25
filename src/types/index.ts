export type Species = 'dog' | 'cat' | 'other';

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: Species;
  breed?: string | null;
  age?: string | null;
  weight?: string | null;
  notes?: string | null;
  photo_url?: string | null;
  vaccination_files?: string[] | null;
}

export interface ProviderInfo {
  business_name?: string | null;
  business_hours?: string | null;
  service_areas?: string[] | null;
  specialties?: string[] | null;
  total_bookings?: number | null;
  rating?: number | null;
  revenue?: number | null;
  services_offered?: string[] | null;
}

export interface UserStats {
  transformations: number;
  following: number;
  followers: number;
}
