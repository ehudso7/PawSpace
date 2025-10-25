export enum ServiceType {
  Haircut = 'haircut',
  Makeup = 'makeup',
  Nails = 'nails',
  Facial = 'facial',
  Massage = 'massage',
  Brows = 'brows',
  Lashes = 'lashes',
  Tattoo = 'tattoo',
  Other = 'other',
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
  is_provider: boolean;
  is_following?: boolean;
  followers_count?: number;
  following_count?: number;
  bio?: string;
}

export type MediaType = 'image' | 'video';

export interface Media {
  id?: string;
  type: MediaType;
  url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  duration_ms?: number;
}

export interface Transformation {
  id: string;
  provider: UserProfile;
  service_type: ServiceType;
  before: Media;
  after: Media;
  caption?: string;
  tags?: string[];
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_saved?: boolean;
  created_at: string; // ISO string
  location_name?: string;
  price_estimate?: number;
}

export interface Comment {
  id: string;
  transformation_id: string;
  user_id: string;
  user: UserProfile;
  text: string;
  likes_count: number;
  is_liked: boolean;
  parent_comment_id?: string;
  replies?: Comment[];
  created_at: string; // ISO string
}

export interface FeedResponse {
  transformations: Transformation[];
  next_page: number | null;
  has_more: boolean;
}
