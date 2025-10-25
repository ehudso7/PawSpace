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
  service_id?: string;
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
  caption: string;
  service_id?: string;
  is_public: boolean;
  transition_type: TransitionType;
  has_music: boolean;
}

export type TransitionType = 
  | 'crossfade'
  | 'slide'
  | 'zoom'
  | 'fade'
  | 'dissolve';

export interface VideoGenerationProgress {
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  message: string;
  videoUrl?: string;
  gifUrl?: string;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
}

export interface CloudinaryTransformationResult {
  public_id: string;
  secure_url: string;
  format: string;
  duration?: number;
}