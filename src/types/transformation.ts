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
  size: number;
  position: Position;
  rotation?: number;
}

export interface Sticker {
  id: string;
  uri: string;
  position: Position;
  scale: number;
  rotation: number;
}

export interface AudioTrack {
  id: string;
  name: string;
  uri: string;
  duration: number;
  waveform?: number[];
}

export interface FrameStyle {
  id: string;
  name: string;
  borderWidth: number;
  borderColor: string;
  borderRadius?: number;
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
}

export interface EditorState {
  beforeImage: string | null;
  afterImage: string | null;
  transition: TransitionType;
  textOverlays: TextOverlay[];
  stickers: Sticker[];
  music: AudioTrack | null;
  frame: FrameStyle | null;
  canvasSize: { width: number; height: number };
}

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  type: string;
  fileSize?: number;
}

export interface TransformationDraft {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  editorState: EditorState;
}

export type EditorTab = 'transition' | 'text' | 'stickers' | 'music' | 'frame';

export interface Font {
  id: string;
  name: string;
  family: string;
}

export interface ColorPreset {
  id: string;
  name: string;
  hex: string;
}

export interface StickerCategory {
  id: string;
  name: string;
  stickers: StickerAsset[];
}

export interface StickerAsset {
  id: string;
  uri: string;
  name: string;
  category: string;
}