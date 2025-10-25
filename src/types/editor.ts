export type TransitionType = 'fade' | 'slide' | 'swipe' | 'split';

export interface Position {
  x: number;
  y: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  font: string;
  color: string;
  size: number; // dp
  position: Position; // % based [0..1] in preview coordinates
}

export interface Sticker {
  id: string;
  uri: string;
  position: Position; // % based [0..1]
  scale: number; // 1.0 = natural size
  rotation: number; // degrees
}

export interface AudioTrack {
  id: string;
  name: string;
  uri: string;
  duration: number; // seconds
}

export interface FrameStyle {
  id: string;
  name: string;
  color: string; // hex
  width: number; // dp
}

export interface EditorState {
  beforeImage?: string;
  afterImage?: string;
  transition: TransitionType;
  textOverlays: TextOverlay[];
  stickers: Sticker[];
  music?: AudioTrack;
  frame?: FrameStyle;
}
