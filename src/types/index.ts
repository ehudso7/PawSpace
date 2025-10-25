export type TransitionType = 'fade' | 'slide' | 'swipe' | 'split';

export interface TextOverlay {
  id: string;
  text: string;
  font: string;
  color: string;
  size: number;
  position: { x: number; y: number };
  rotation: number;
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
  duration: number;
}

export interface FrameStyle {
  id: string;
  name: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
}

export interface EditorState {
  beforeImage: string | null;
  afterImage: string | null;
  transition: TransitionType;
  textOverlays: TextOverlay[];
  stickers: Sticker[];
  music?: AudioTrack;
  frame?: FrameStyle;
  isProcessing: boolean;
}

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
}

export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
}

export interface ColorOption {
  id: string;
  name: string;
  color: string;
}