export type TransitionType = 'crossfade' | 'slide' | 'none';

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
}

export interface Transformation {
  id: string;
  user_id: string;
  user: UserProfile;
  before_image_url: string;
  after_image_url: string;
  video_url?: string;
  gif_url?: string;
  caption: string;
  service_id?: string; // Link to booked service
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_public: boolean;
  created_at: string;
}

export interface CreateTransformationData {
  before_image_url: string;
  after_image_url: string;
  video_url?: string;
  caption: string;
  service_id?: string;
  is_public: boolean;
  transition_type: TransitionType;
  has_music: boolean;
}

export interface DraftData {
  before_image_url: string;
  after_image_url: string;
  caption?: string;
  service_id?: string;
  is_public?: boolean;
  transition_type?: TransitionType;
  has_music?: boolean;
}

export type SharePlatform = 'instagram' | 'tiktok';
