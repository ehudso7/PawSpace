export type TransitionType =
  | "fade"
  | "wipeLeft"
  | "wipeRight"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "crossZoom"
  | "circleOpen"
  | "circleClose";

export interface TextOverlay {
  text: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string; // Hex or named color
  opacity?: number; // 0..100
  position?: "top" | "center" | "bottom" | { x: number; y: number };
  startTime?: number; // seconds
  duration?: number; // seconds
}

export type EffectName =
  | "grayscale"
  | "sepia"
  | "blur"
  | "sharpen"
  | "brightness"
  | "contrast"
  | "saturation"
  | "vibrance"
  | "zoomIn"
  | "zoomOut"
  | "slowMotion";

export interface Effect {
  name: EffectName;
  value?: number; // generic numeric intensity (mapped per effect)
}

export interface VideoParams {
  beforeImageUrl: string;
  afterImageUrl: string;
  transition: TransitionType;
  duration: number; // total seconds for the whole video
  textOverlays: TextOverlay[];
  audioTrack?: string; // Cloudinary public_id for audio or remote URL
  fps: number;
  width?: number; // px
  height?: number; // px
  folder?: string; // Cloudinary folder for generated assets
}

export type PrivacySetting = "public" | "private";

export interface ServiceTag {
  label: string;
  url?: string;
}

export interface PostPayload {
  caption: string;
  serviceTag?: ServiceTag;
  hashtags: string[];
  privacy: PrivacySetting;
  videoUrl: string;
}