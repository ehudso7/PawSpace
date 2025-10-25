export type TransitionType = 
  | 'fade' 
  | 'slide' 
  | 'zoom' 
  | 'dissolve' 
  | 'wipe'
  | 'none';

export interface TextOverlay {
  text: string;
  position: 'top' | 'center' | 'bottom';
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  timestamp: number; // When to show (in seconds)
  duration: number; // How long to show (in seconds)
}

export interface Effect {
  type: 'brightness' | 'contrast' | 'saturation' | 'blur' | 'sharpen';
  intensity: number;
}

export interface VideoParams {
  beforeImageUrl: string;
  afterImageUrl: string;
  transition: TransitionType;
  duration: number; // seconds
  textOverlays: TextOverlay[];
  audioTrack?: string;
  fps: number;
}

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
}

export interface VideoMetadata {
  id: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  createdAt: Date;
}

export interface PublishOptions {
  caption: string;
  serviceTag?: string;
  hashtags: string[];
  isPrivate: boolean;
  provider?: {
    name: string;
    link: string;
  };
}

export interface ShareDestination {
  platform: 'instagram' | 'tiktok' | 'facebook' | 'twitter';
  caption: string;
  hashtags: string[];
}
