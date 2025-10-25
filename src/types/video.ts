export interface VideoGenerationParams {
  beforeImageUri: string;
  afterImageUri: string;
  transition: TransitionType;
  duration: number;
  textOverlays: TextOverlay[];
  audioTrack?: string;
  fps: number;
  effects?: Effect[];
}

export interface VideoExportOptions {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  format: 'mp4' | 'mov' | 'avi';
  resolution: '480p' | '720p' | '1080p' | '4k';
  compression: number; // 0-100
}

export interface VideoPublishOptions {
  caption: string;
  hashtags: string[];
  privacy: 'public' | 'private';
  serviceTag?: string;
  platform: 'pawspace' | 'instagram' | 'tiktok' | 'youtube';
}

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  isLooping: boolean;
  playbackRate: number;
}

export interface VideoGenerationProgress {
  stage: 'uploading' | 'processing' | 'applying_effects' | 'finalizing' | 'complete';
  progress: number; // 0-100
  message: string;
}

export type TransitionType = 'fade' | 'slide' | 'zoom' | 'dissolve' | 'wipe';

export interface TextOverlay {
  id: string;
  text: string;
  position: 'top' | 'center' | 'bottom';
  fontSize: number;
  color: string;
  fontFamily: string;
  startTime: number;
  endTime: number;
  isVisible: boolean;
}

export interface Effect {
  id: string;
  type: 'blur' | 'brightness' | 'contrast' | 'saturation' | 'vintage' | 'sepia';
  intensity: number;
  duration?: number;
  isEnabled: boolean;
}

export interface HashtagSuggestion {
  tag: string;
  category: 'pet' | 'grooming' | 'transformation' | 'before_after' | 'trending';
  popularity: number;
}

export interface ServiceTag {
  id: string;
  name: string;
  provider: string;
  serviceUrl?: string;
  category: 'grooming' | 'veterinary' | 'training' | 'boarding' | 'other';
}

export interface VideoShareOptions {
  platforms: ('instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter')[];
  includeWatermark: boolean;
  customMessage?: string;
}