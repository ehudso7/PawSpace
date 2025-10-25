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
  type: 'border' | 'rounded' | 'shadow';
  color: string;
  width: number;
}

export interface EditorState {
  beforeImage: string;
  afterImage: string;
  transition: TransitionType;
  textOverlays: TextOverlay[];
  stickers: Sticker[];
  music?: AudioTrack;
  frame?: FrameStyle;
  history: EditorState[];
  historyIndex: number;
}

export interface EditorAction {
  type: 'SET_IMAGES' | 'SET_TRANSITION' | 'ADD_TEXT' | 'UPDATE_TEXT' | 'REMOVE_TEXT' |
        'ADD_STICKER' | 'UPDATE_STICKER' | 'REMOVE_STICKER' | 'SET_MUSIC' | 
        'SET_FRAME' | 'UNDO' | 'REDO' | 'RESET';
  payload?: any;
}

export const FONTS = [
  'System',
  'Roboto-Bold',
  'Playfair-Display',
  'Pacifico-Regular',
  'Montserrat-Bold',
] as const;

export const PRESET_COLORS = [
  '#FFFFFF',
  '#000000',
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#F8B500',
] as const;

export const TRANSITIONS: TransitionType[] = ['fade', 'slide', 'swipe', 'split'];
