import { create } from 'zustand';
import { EditorState, TransitionType, TextOverlay, Sticker, AudioTrack, FrameStyle } from '../types';

interface EditorStore extends EditorState {
  // History management
  history: EditorState[];
  historyIndex: number;
  
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
  canUndo: () => boolean;
  canRedo: () => boolean;
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

const MAX_HISTORY_LENGTH = 20;

// Helper to extract the editor state (without history and actions)
const extractEditorState = (state: EditorStore): EditorState => ({
  beforeImage: state.beforeImage,
  afterImage: state.afterImage,
  transition: state.transition,
  textOverlays: state.textOverlays,
  stickers: state.stickers,
  music: state.music,
  frame: state.frame,
  isProcessing: state.isProcessing,
});

// Helper to add to history
const addToHistory = (state: EditorStore): Partial<EditorStore> => {
  const currentState = extractEditorState(state);
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(currentState);
  
  // Limit history size
  if (newHistory.length > MAX_HISTORY_LENGTH) {
    newHistory.shift();
  }
  
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,
  history: [initialState],
  historyIndex: 0,
  
  setBeforeImage: (uri) => set((state) => ({
    beforeImage: uri,
    ...addToHistory({ ...state, beforeImage: uri }),
  })),
  
  setAfterImage: (uri) => set((state) => ({
    afterImage: uri,
    ...addToHistory({ ...state, afterImage: uri }),
  })),
  
  setTransition: (transition) => set((state) => ({
    transition,
    ...addToHistory({ ...state, transition }),
  })),
  
  addTextOverlay: (overlay) => set((state) => {
    const textOverlays = [...state.textOverlays, overlay];
    return {
      textOverlays,
      ...addToHistory({ ...state, textOverlays }),
    };
  }),
  
  updateTextOverlay: (id, updates) => set((state) => {
    const textOverlays = state.textOverlays.map(overlay =>
      overlay.id === id ? { ...overlay, ...updates } : overlay
    );
    return {
      textOverlays,
      ...addToHistory({ ...state, textOverlays }),
    };
  }),
  
  removeTextOverlay: (id) => set((state) => {
    const textOverlays = state.textOverlays.filter(overlay => overlay.id !== id);
    return {
      textOverlays,
      ...addToHistory({ ...state, textOverlays }),
    };
  }),
  
  addSticker: (sticker) => set((state) => {
    const stickers = [...state.stickers, sticker];
    return {
      stickers,
      ...addToHistory({ ...state, stickers }),
    };
  }),
  
  updateSticker: (id, updates) => set((state) => {
    const stickers = state.stickers.map(sticker =>
      sticker.id === id ? { ...sticker, ...updates } : sticker
    );
    return {
      stickers,
      ...addToHistory({ ...state, stickers }),
    };
  }),
  
  removeSticker: (id) => set((state) => {
    const stickers = state.stickers.filter(sticker => sticker.id !== id);
    return {
      stickers,
      ...addToHistory({ ...state, stickers }),
    };
  }),
  
  setMusic: (music) => set((state) => ({
    music,
    ...addToHistory({ ...state, music }),
  })),
  
  setFrame: (frame) => set((state) => ({
    frame,
    ...addToHistory({ ...state, frame }),
  })),
  
  setProcessing: (isProcessing) => set({ isProcessing }),
  
  resetEditor: () => set({
    ...initialState,
    history: [initialState],
    historyIndex: 0,
  }),
  
  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const previousState = state.history[newIndex];
      set({
        ...previousState,
        history: state.history,
        historyIndex: newIndex,
      });
    }
  },
  
  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const nextState = state.history[newIndex];
      set({
        ...nextState,
        history: state.history,
        historyIndex: newIndex,
      });
    }
  },
  
  canUndo: () => {
    const state = get();
    return state.historyIndex > 0;
  },
  
  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },
}));
