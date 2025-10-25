export type TransitionType =
  | "fade"
  | "slideLeft"
  | "slideRight"
  | "slideUp"
  | "slideDown"
  | "wipe"
  | "none";

export interface TextOverlayPosition {
  x: number; // pixels from left
  y: number; // pixels from top
}

export interface TextOverlay {
  text: string;
  fontFamily: string;
  fontSize: number; // px
  color?: string; // hex or named
  position: TextOverlayPosition;
  startAt?: number; // seconds
  endAt?: number; // seconds
}

export type EffectKind =
  | "grayscale"
  | "blur"
  | "sharpen"
  | "brightness"
  | "contrast"
  | "saturation"
  | "sepia"
  | "vignette"
  | "zoompan";

export interface Effect {
  kind: EffectKind;
  value?: number; // optional strength/intensity for supported effects
}

export interface VideoParams {
  beforeImageUrl: string;
  afterImageUrl: string;
  transition: TransitionType;
  duration: number; // seconds (total target duration)
  textOverlays: TextOverlay[];
  audioTrack?: string; // public id or remote url
  fps: number;
}
