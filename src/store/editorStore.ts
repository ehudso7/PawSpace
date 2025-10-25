import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EditorState, TextOverlay, Sticker, AudioTrack, FrameStyle, TransitionType } from '../types/editor';

interface HistoryState {
  past: EditorState[];
  present: EditorState;
  future: EditorState[];
}

interface EditorStore extends HistoryState {
  // setters
  setBefore: (uri?: string) => void;
  setAfter: (uri?: string) => void;
  setTransition: (t: TransitionType) => void;
  addText: (overlay: TextOverlay) => void;
  updateText: (overlay: TextOverlay) => void;
  removeText: (id: string) => void;
  addSticker: (sticker: Sticker) => void;
  updateSticker: (sticker: Sticker) => void;
  removeSticker: (id: string) => void;
  setMusic: (track?: AudioTrack) => void;
  setFrame: (frame?: FrameStyle) => void;
  reset: () => void;
  // history
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const initialPresent: EditorState = {
  beforeImage: undefined,
  afterImage: undefined,
  transition: 'fade',
  textOverlays: [],
  stickers: [],
  music: undefined,
  frame: undefined,
};

function withHistory(state: HistoryState, nextPresent: EditorState): HistoryState {
  return {
    past: [...state.past, state.present],
    present: nextPresent,
    future: [],
  };
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      past: [],
      present: initialPresent,
      future: [],

      setBefore: (uri) => set((s) => withHistory(s, { ...s.present, beforeImage: uri })),
      setAfter: (uri) => set((s) => withHistory(s, { ...s.present, afterImage: uri })),
      setTransition: (t) => set((s) => withHistory(s, { ...s.present, transition: t })),

      addText: (overlay) => set((s) => withHistory(s, { ...s.present, textOverlays: [...s.present.textOverlays, overlay] })),
      updateText: (overlay) => set((s) => withHistory(s, { ...s.present, textOverlays: s.present.textOverlays.map((o) => (o.id === overlay.id ? overlay : o)) })),
      removeText: (id) => set((s) => withHistory(s, { ...s.present, textOverlays: s.present.textOverlays.filter((o) => o.id !== id) })),

      addSticker: (sticker) => set((s) => withHistory(s, { ...s.present, stickers: [...s.present.stickers, sticker] })),
      updateSticker: (sticker) => set((s) => withHistory(s, { ...s.present, stickers: s.present.stickers.map((o) => (o.id === sticker.id ? sticker : o)) })),
      removeSticker: (id) => set((s) => withHistory(s, { ...s.present, stickers: s.present.stickers.filter((o) => o.id !== id) })),

      setMusic: (track) => set((s) => withHistory(s, { ...s.present, music: track })),
      setFrame: (frame) => set((s) => withHistory(s, { ...s.present, frame })),

      reset: () => set({ past: [], present: initialPresent, future: [] }),

      undo: () => {
        const { past, present, future } = get();
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        set({
          past: past.slice(0, -1),
          present: previous,
          future: [present, ...future],
        });
      },
      redo: () => {
        const { past, present, future } = get();
        if (future.length === 0) return;
        const next = future[0];
        set({
          past: [...past, present],
          present: next,
          future: future.slice(1),
        });
      },
      canUndo: () => get().past.length > 0,
      canRedo: () => get().future.length > 0,
    }),
    {
      name: 'pawspace-editor',
      partialize: (state) => ({ present: state.present }),
    }
  )
);
