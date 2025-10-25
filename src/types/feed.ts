export type ServiceType =
  | 'haircut'
  | 'color'
  | 'makeup'
  | 'nails'
  | 'skincare'
  | 'tattoo'
  | 'massage'
  | 'other';

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  is_provider?: boolean;
  is_following?: boolean;
}

export interface MediaAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
  aspect_ratio?: number; // width/height
  duration_ms?: number; // for video
}

export interface Transformation {
  id: string;
  provider: UserProfile;
  service_type: ServiceType;
  caption?: string;
  before: MediaAsset;
  after: MediaAsset;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_saved: boolean;
  created_at: string; // ISO
  location_name?: string;
}

export interface FeedResponse {
  transformations: Transformation[];
  next_page: number | null;
  has_more: boolean;
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
  created_at: string;
}
