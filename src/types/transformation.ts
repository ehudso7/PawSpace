export type TransitionType = 'crossfade' | 'slide' | 'zoom' | 'morph' | 'wipe';

export type ExportFormat = 'video' | 'gif';

export type SocialPlatform = 'instagram' | 'tiktok' | 'snapchat';

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  display_name: string;
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
  transition_type: TransitionType;
  has_music: boolean;
  duration_seconds: number;
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
  duration_seconds?: number;
}

export interface DraftData {
  before_image_url?: string;
  after_image_url?: string;
  caption?: string;
  transition_type?: TransitionType;
  has_music?: boolean;
  is_public?: boolean;
}

export interface VideoGenerationProgress {
  stage: 'uploading' | 'processing' | 'generating' | 'finalizing' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
  estimated_time_remaining?: number; // seconds
}

export interface CloudinaryUploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
}

export interface VideoGenerationOptions {
  transition_type: TransitionType;
  duration_seconds: number;
  has_music: boolean;
  format: ExportFormat;
  quality: 'auto' | 'low' | 'medium' | 'high';
}

export interface ShareOptions {
  platform?: SocialPlatform;
  save_to_device: boolean;
  include_watermark: boolean;
  custom_caption?: string;
}

export interface ExportResult {
  success: boolean;
  url?: string;
  local_path?: string;
  error?: string;
  format: ExportFormat;
}