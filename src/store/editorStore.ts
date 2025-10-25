import { create } from 'zustand';
import { EditorState, TransitionType, TextOverlay, Sticker, AudioTrack, FrameStyle } from '../types';

interface EditorStore extends EditorState {
  // Actions
  setBeforeImage: (uri: string | null) => void;
  setAfterImage: (uri: string | null) => void;
  setTransition: (transition: TransitionType) => void;
  addTextOverlay: (overlay: TextOverlay) => void;
  updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => void;
  removeTextOverlay: (id: string) => void;
  addSticker: (sticker: Sticker) => void;
  updateSticker: (id: string, updates: Partial<Sticker>) => void;
  removeSticker: (id: string) => void;
  setMusic: (music: AudioTrack | undefined) => void;
  setFrame: (frame: FrameStyle | undefined) => void;
  setProcessing: (isProcessing: boolean) => void;
  resetEditor: () => void;
  undo: () => void;
  redo: () => void;
}

const initialState: EditorState = {
  beforeImage: null,
  afterImage: null,
  transition: 'fade',
  textOverlays: [],
  stickers: [],
  music: undefined,
  frame: undefined,
  isProcessing: false,
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,
  
  setBeforeImage: (uri) => set({ beforeImage: uri }),
  
  setAfterImage: (uri) => set({ afterImage: uri }),
  
  setTransition: (transition) => set({ transition }),
  
  addTextOverlay: (overlay) => set((state) => ({
    textOverlays: [...state.textOverlays, overlay]
  })),
  
  updateTextOverlay: (id, updates) => set((state) => ({
    textOverlays: state.textOverlays.map(overlay =>
      overlay.id === id ? { ...overlay, ...updates } : overlay
    )
  })),
  
  removeTextOverlay: (id) => set((state) => ({
    textOverlays: state.textOverlays.filter(overlay => overlay.id !== id)
  })),
  
  addSticker: (sticker) => set((state) => ({
    stickers: [...state.stickers, sticker]
  })),
  
  updateSticker: (id, updates) => set((state) => ({
    stickers: state.stickers.map(sticker =>
      sticker.id === id ? { ...sticker, ...updates } : sticker
    )
  })),
  
  removeSticker: (id) => set((state) => ({
    stickers: state.stickers.filter(sticker => sticker.id !== id)
  })),
  
  setMusic: (music) => set({ music }),
  
  setFrame: (frame) => set({ frame }),
  
  setProcessing: (isProcessing) => set({ isProcessing }),
  
  resetEditor: () => set(initialState),
  
  undo: () => {
    // TODO: Implement undo functionality with history
    console.log('Undo not implemented yet');
  },
  
  redo: () => {
    // TODO: Implement redo functionality with history
    console.log('Redo not implemented yet');
  },
}));