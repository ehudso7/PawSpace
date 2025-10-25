import { create } from 'zustand';
import { EditorState, TextOverlay, Sticker, AudioTrack, FrameStyle, TransitionType } from '../types/editor';

interface EditorStore extends EditorState {
  setImages: (before: string, after: string) => void;
  setTransition: (transition: TransitionType) => void;
  addText: (text: TextOverlay) => void;
  updateText: (id: string, updates: Partial<TextOverlay>) => void;
  removeText: (id: string) => void;
  addSticker: (sticker: Sticker) => void;
  updateSticker: (id: string, updates: Partial<Sticker>) => void;
  removeSticker: (id: string) => void;
  setMusic: (music?: AudioTrack) => void;
  setFrame: (frame?: FrameStyle) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  saveHistory: () => void;
}

const initialState: EditorState = {
  beforeImage: '',
  afterImage: '',
  transition: 'fade',
  textOverlays: [],
  stickers: [],
  music: undefined,
  frame: undefined,
  history: [],
  historyIndex: -1,
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,

  setImages: (before: string, after: string) => {
    set({ beforeImage: before, afterImage: after });
    get().saveHistory();
  },

  setTransition: (transition: TransitionType) => {
    set({ transition });
    get().saveHistory();
  },

  addText: (text: TextOverlay) => {
    set((state) => ({
      textOverlays: [...state.textOverlays, text],
    }));
    get().saveHistory();
  },

  updateText: (id: string, updates: Partial<TextOverlay>) => {
    set((state) => ({
      textOverlays: state.textOverlays.map((text) =>
        text.id === id ? { ...text, ...updates } : text
      ),
    }));
    get().saveHistory();
  },

  removeText: (id: string) => {
    set((state) => ({
      textOverlays: state.textOverlays.filter((text) => text.id !== id),
    }));
    get().saveHistory();
  },

  addSticker: (sticker: Sticker) => {
    set((state) => ({
      stickers: [...state.stickers, sticker],
    }));
    get().saveHistory();
  },

  updateSticker: (id: string, updates: Partial<Sticker>) => {
    set((state) => ({
      stickers: state.stickers.map((sticker) =>
        sticker.id === id ? { ...sticker, ...updates } : sticker
      ),
    }));
    get().saveHistory();
  },

  removeSticker: (id: string) => {
    set((state) => ({
      stickers: state.stickers.filter((sticker) => sticker.id !== id),
    }));
    get().saveHistory();
  },

  setMusic: (music?: AudioTrack) => {
    set({ music });
    get().saveHistory();
  },

  setFrame: (frame?: FrameStyle) => {
    set({ frame });
    get().saveHistory();
  },

  saveHistory: () => {
    const state = get();
    const currentState: EditorState = {
      beforeImage: state.beforeImage,
      afterImage: state.afterImage,
      transition: state.transition,
      textOverlays: state.textOverlays,
      stickers: state.stickers,
      music: state.music,
      frame: state.frame,
      history: [],
      historyIndex: -1,
    };

    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(currentState);

    // Limit history to 20 states
    if (newHistory.length > 20) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const previousState = state.history[state.historyIndex - 1];
      set({
        ...previousState,
        history: state.history,
        historyIndex: state.historyIndex - 1,
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const nextState = state.history[state.historyIndex + 1];
      set({
        ...nextState,
        history: state.history,
        historyIndex: state.historyIndex + 1,
      });
    }
  },

  reset: () => {
    set(initialState);
  },
}));
