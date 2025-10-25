export type TransitionType = 'fade' | 'slide' | 'swipe' | 'split';

export interface TextOverlay {
  id: string;
  text: string;
  font: string; // e.g., 'System', 'Serif', 'Monospace', etc.
  color: string; // hex
  size: number; // font size in px
  position: { x: number; y: number };
  scale?: number;
  rotation?: number;
}

export interface Sticker {
  id: string;
  uri: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

export interface AudioTrack {
  id: string;
  name: string;
  uri: string;
  duration: number; // seconds
}

export type FrameStyleName = 'none' | 'simple' | 'rounded' | 'shadow';

export interface FrameStyle {
  name: FrameStyleName;
  color: string;
  width: number;
  radius?: number;
}

export interface EditorState {
  beforeImage?: string;
  afterImage?: string;
  transition: TransitionType;
  textOverlays: TextOverlay[];
  stickers: Sticker[];
  music?: AudioTrack;
  musicVolume: number; // 0..1
  frame?: FrameStyle;
}
