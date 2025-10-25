/**
 * Transformation Types
 * Defines data structures for user transformations (before/after photos/videos)
 */

export type TransitionType = 
  | 'fade'
  | 'slide'
  | 'zoom'
  | 'swipe'
  | 'crossfade';

export type SharePlatform = 'instagram' | 'tiktok' | 'facebook' | 'twitter';

export interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  is_verified?: boolean;
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
  transition_type: TransitionType;
  has_music: boolean;
  duration_seconds?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTransformationData {
  before_image_url: string;
  after_image_url: string;
  video_url?: string;
  gif_url?: string;
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
  transition_type?: TransitionType;
  has_music?: boolean;
}

export interface TransformationDraft {
  id: string;
  user_id: string;
  data: DraftData;
  created_at: string;
  updated_at: string;
}

export interface VideoGenerationOptions {
  transition_type: TransitionType;
  duration_seconds: number;
  has_music: boolean;
  music_url?: string;
  format: 'mp4' | 'gif';
}

export interface VideoGenerationProgress {
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  message: string;
  estimated_time_remaining?: number; // seconds
}

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
}

export interface CloudinaryVideoResponse {
  status: 'pending' | 'processing' | 'complete' | 'error';
  video_url?: string;
  public_id: string;
  progress?: number;
}
