import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';
import type { EditorState, TextOverlay, Sticker, TransitionType, AudioTrack, FrameStyle } from '@/types/create';

interface EditorStore extends EditorState {
  // history
  _past: EditorState[];
  _future: EditorState[];
  // actions
  setBeforeImage: (uri?: string) => void;
  setAfterImage: (uri?: string) => void;
  setTransition: (t: TransitionType) => void;
  addTextOverlay: (overlay: Partial<TextOverlay>) => string;
  updateTextOverlay: (id: string, overlay: Partial<TextOverlay>) => void;
  removeTextOverlay: (id: string) => void;
  addSticker: (sticker: Partial<Sticker>) => string;
  updateSticker: (id: string, sticker: Partial<Sticker>) => void;
  removeSticker: (id: string) => void;
  setMusic: (track?: AudioTrack) => void;
  setMusicVolume: (v: number) => void;
  setFrame: (frame?: FrameStyle) => void;
  reset: () => void;
  undo: () => void;
  redo: () => void;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
}

const initialState: EditorState = {
  beforeImage: undefined,
  afterImage: undefined,
  transition: 'fade',
  textOverlays: [],
  stickers: [],
  music: undefined,
  musicVolume: 0.8,
  frame: { name: 'none', color: '#ffffff', width: 0, radius: 0 },
};

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function withHistory(set: any, get: any, mutate: (draft: EditorState) => void) {
  const current = get() as EditorStore;
  const present: EditorState = {
    beforeImage: current.beforeImage,
    afterImage: current.afterImage,
    transition: current.transition,
    textOverlays: current.textOverlays,
    stickers: current.stickers,
    music: current.music,
    musicVolume: current.musicVolume,
    frame: current.frame,
  };
  const past = current._past.slice();
  past.push(deepClone(present));
  const future: EditorState[] = [];
  const next = deepClone(present);
  mutate(next);
  set({ ...next, _past: past, _future: future });
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,
  _past: [],
  _future: [],

  setBeforeImage: (uri) => withHistory(set, get, (draft) => { draft.beforeImage = uri; }),
  setAfterImage: (uri) => withHistory(set, get, (draft) => { draft.afterImage = uri; }),
  setTransition: (t) => withHistory(set, get, (draft) => { draft.transition = t; }),

  addTextOverlay: (overlay) => {
    let id = overlay.id ?? nanoid();
    withHistory(set, get, (draft) => {
      const newOverlay: TextOverlay = {
        id,
        text: overlay.text ?? 'Text',
        font: overlay.font ?? 'System',
        color: overlay.color ?? '#ffffff',
        size: overlay.size ?? 24,
        position: overlay.position ?? { x: 50, y: 50 },
        scale: overlay.scale ?? 1,
        rotation: overlay.rotation ?? 0,
      };
      draft.textOverlays = [...draft.textOverlays, newOverlay];
    });
    return id;
  },
  updateTextOverlay: (id, overlay) => withHistory(set, get, (draft) => {
    draft.textOverlays = draft.textOverlays.map((t) => (t.id === id ? { ...t, ...overlay } : t));
  }),
  removeTextOverlay: (id) => withHistory(set, get, (draft) => {
    draft.textOverlays = draft.textOverlays.filter((t) => t.id !== id);
  }),

  addSticker: (sticker) => {
    const id = sticker.id ?? nanoid();
    withHistory(set, get, (draft) => {
      const newSticker: Sticker = {
        id,
        uri: sticker.uri ?? '',
        position: sticker.position ?? { x: 50, y: 50 },
        scale: sticker.scale ?? 1,
        rotation: sticker.rotation ?? 0,
      } as Sticker;
      draft.stickers = [...draft.stickers, newSticker];
    });
    return id;
  },
  updateSticker: (id, sticker) => withHistory(set, get, (draft) => {
    draft.stickers = draft.stickers.map((s) => (s.id === id ? { ...s, ...sticker } : s));
  }),
  removeSticker: (id) => withHistory(set, get, (draft) => {
    draft.stickers = draft.stickers.filter((s) => s.id !== id);
  }),

  setMusic: (track) => withHistory(set, get, (draft) => { draft.music = track; }),
  setMusicVolume: (v) => withHistory(set, get, (draft) => { draft.musicVolume = Math.max(0, Math.min(1, v)); }),
  setFrame: (frame) => withHistory(set, get, (draft) => { draft.frame = frame; }),

  reset: () => set({ ...initialState, _past: [], _future: [] }),
  undo: () => {
    const { _past, _future } = get();
    if (_past.length === 0) return;
    const past = _past.slice();
    const previous = past.pop()!;
    const current: EditorState = {
      beforeImage: get().beforeImage,
      afterImage: get().afterImage,
      transition: get().transition,
      textOverlays: get().textOverlays,
      stickers: get().stickers,
      music: get().music,
      musicVolume: get().musicVolume,
      frame: get().frame,
    };
    const future = [deepClone(current), ..._future];
    set({ ...previous, _past: past, _future: future });
  },
  redo: () => {
    const { _past, _future } = get();
    if (_future.length === 0) return;
    const future = _future.slice();
    const next = future.shift()!;
    const current: EditorState = {
      beforeImage: get().beforeImage,
      afterImage: get().afterImage,
      transition: get().transition,
      textOverlays: get().textOverlays,
      stickers: get().stickers,
      music: get().music,
      musicVolume: get().musicVolume,
      frame: get().frame,
    };
    const past = [..._past, deepClone(current)];
    set({ ...next, _past: past, _future: future });
  },

  saveDraft: async () => {
    const state: EditorState = {
      beforeImage: get().beforeImage,
      afterImage: get().afterImage,
      transition: get().transition,
      textOverlays: get().textOverlays,
      stickers: get().stickers,
      music: get().music,
      musicVolume: get().musicVolume,
      frame: get().frame,
    };
    await AsyncStorage.setItem('editorDraft', JSON.stringify(state));
  },
  loadDraft: async () => {
    const raw = await AsyncStorage.getItem('editorDraft');
    if (!raw) return;
    const state = JSON.parse(raw) as EditorState;
    set({ ...initialState, ...state, _past: [], _future: [] });
  },
}));
