export type TransitionType = 'crossfade' | 'slide' | 'zoom' | 'none';

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
  gif_url?: string;
  caption: string;
  service_id?: string;
  is_public: boolean;
  transition_type: TransitionType;
  has_music: boolean;
}

export interface DraftData {
  before_image_url?: string;
  after_image_url?: string;
  caption?: string;
  service_id?: string;
  is_public?: boolean;
  transition_type?: TransitionType;
  has_music?: boolean;
}

export interface GenerationResult {
  videoUrl?: string;
  gifUrl?: string;
  publicId?: string; // Cloudinary public id for the generated asset
}

export interface ProgressState {
  status:
    | 'idle'
    | 'uploading'
    | 'generating'
    | 'polling'
    | 'saving'
    | 'sharing'
    | 'done'
    | 'error';
  progress: number; // 0..1
  message?: string;
  error?: string;
}
