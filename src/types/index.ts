export interface UserProfile {
  full_name: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export interface User {
  id: string;
  email: string;
  user_type: 'pet_owner' | 'service_provider';
  profile: UserProfile;
}
