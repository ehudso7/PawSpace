export interface VideoParams {
  beforeImageUrl: string;
  afterImageUrl: string;
  transition: TransitionType;
  duration: number; // seconds
  textOverlays: TextOverlay[];
  audioTrack?: string;
  fps: number;
}

export interface TextOverlay {
  text: string;
  position: Position;
  style: TextStyle;
  startTime: number; // seconds
  duration: number; // seconds
}

export interface Position {
  x: number; // percentage from left
  y: number; // percentage from top
}

export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor?: string;
  bold?: boolean;
  italic?: boolean;
}

export interface Effect {
  type: EffectType;
  intensity: number;
  startTime?: number;
  duration?: number;
}

export type TransitionType = 
  | 'fade'
  | 'slide_left'
  | 'slide_right'
  | 'slide_up'
  | 'slide_down'
  | 'zoom_in'
  | 'zoom_out'
  | 'dissolve'
  | 'wipe_left'
  | 'wipe_right';

export type EffectType =
  | 'blur'
  | 'brightness'
  | 'contrast'
  | 'saturation'
  | 'sepia'
  | 'grayscale'
  | 'vignette';

export interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

export interface VideoGenerationResult {
  videoUrl: string;
  publicId: string;
  duration: number;
  format: string;
  bytes: number;
}

export interface PublishingOptions {
  caption: string;
  serviceTag?: string;
  hashtags: string[];
  privacy: 'public' | 'private';
  platforms: Platform[];
}

export type Platform = 'pawspace' | 'instagram' | 'tiktok' | 'twitter';

export interface ShareOptions {
  title: string;
  message: string;
  url: string;
  type: 'video/mp4';
}

export interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  isLooping: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
}