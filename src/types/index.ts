export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio?: string;
  followers_count: number;
  following_count: number;
  is_following: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface ServiceType {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnail_url?: string;
  duration?: number;
  width: number;
  height: number;
}

export interface Transformation {
  id: string;
  user: UserProfile;
  service: ServiceType;
  before_media: MediaItem;
  after_media: MediaItem;
  caption: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_saved: boolean;
  created_at: string;
  updated_at: string;
  location?: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  tags: string[];
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
  updated_at: string;
}

export interface FeedResponse {
  transformations: Transformation[];
  next_page: number | null;
  has_more: boolean;
  total_count: number;
}

export interface Story {
  id: string;
  user: UserProfile;
  media: MediaItem[];
  created_at: string;
  is_viewed: boolean;
  expires_at: string;
}

export interface SearchResult {
  users: UserProfile[];
  transformations: Transformation[];
  services: ServiceType[];
}

export interface ReportReason {
  id: string;
  label: string;
  description: string;
}

export interface FeedFilters {
  service_type?: string;
  date_range?: {
    start: Date;
    end: Date;
  };
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  sort_by?: 'recent' | 'popular' | 'trending';
}