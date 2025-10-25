import { create } from 'zustand';
import { EditorState, TextOverlay, Sticker, AudioTrack, FrameStyle, TransitionType, EditorTab } from '../types/transformation';
import { CANVAS_SIZE } from '../constants/editor';

interface EditorStore extends EditorState {
  // UI State
  activeTab: EditorTab;
  isPreviewMode: boolean;
  isLoading: boolean;
  selectedTextId: string | null;
  selectedStickerId: string | null;
  
  // History
  history: EditorState[];
  historyIndex: number;
  
  // Actions
  setBeforeImage: (uri: string) => void;
  setAfterImage: (uri: string) => void;
  setTransition: (transition: TransitionType) => void;
  setActiveTab: (tab: EditorTab) => void;
  setPreviewMode: (isPreview: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Text overlay actions
  addTextOverlay: (text: string) => void;
  updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => void;
  removeTextOverlay: (id: string) => void;
  selectText: (id: string | null) => void;
  
  // Sticker actions
  addSticker: (uri: string) => void;
  updateSticker: (id: string, updates: Partial<Sticker>) => void;
  removeSticker: (id: string) => void;
  selectSticker: (id: string | null) => void;
  
  // Audio actions
  setMusic: (track: AudioTrack | null) => void;
  
  // Frame actions
  setFrame: (frame: FrameStyle | null) => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;
  
  // Reset
  reset: () => void;
  
  // Export state
  getExportState: () => EditorState;
}

const initialState: EditorState = {
  beforeImage: null,
  afterImage: null,
  transition: 'fade',
  textOverlays: [],
  stickers: [],
  music: null,
  frame: null,
  canvasSize: CANVAS_SIZE,
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,
  
  // UI State
  activeTab: 'transition',
  isPreviewMode: false,
  isLoading: false,
  selectedTextId: null,
  selectedStickerId: null,
  
  // History
  history: [initialState],
  historyIndex: 0,
  
  // Actions
  setBeforeImage: (uri: string) => {
    set({ beforeImage: uri });
    get().saveToHistory();
  },
  
  setAfterImage: (uri: string) => {
    set({ afterImage: uri });
    get().saveToHistory();
  },
  
  setTransition: (transition: TransitionType) => {
    set({ transition });
    get().saveToHistory();
  },
  
  setActiveTab: (tab: EditorTab) => {
    set({ 
      activeTab: tab,
      selectedTextId: null,
      selectedStickerId: null,
    });
  },
  
  setPreviewMode: (isPreview: boolean) => {
    set({ isPreviewMode: isPreview });
  },
  
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
  
  // Text overlay actions
  addTextOverlay: (text: string) => {
    const newOverlay: TextOverlay = {
      id: `text_${Date.now()}`,
      text,
      font: 'roboto',
      color: '#FFFFFF',
      size: 24,
      position: { 
        x: get().canvasSize.width / 2, 
        y: get().canvasSize.height / 2 
      },
      rotation: 0,
    };
    
    set(state => ({
      textOverlays: [...state.textOverlays, newOverlay],
      selectedTextId: newOverlay.id,
    }));
    get().saveToHistory();
  },
  
  updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => {
    set(state => ({
      textOverlays: state.textOverlays.map(overlay =>
        overlay.id === id ? { ...overlay, ...updates } : overlay
      ),
    }));
    get().saveToHistory();
  },
  
  removeTextOverlay: (id: string) => {
    set(state => ({
      textOverlays: state.textOverlays.filter(overlay => overlay.id !== id),
      selectedTextId: state.selectedTextId === id ? null : state.selectedTextId,
    }));
    get().saveToHistory();
  },
  
  selectText: (id: string | null) => {
    set({ 
      selectedTextId: id,
      selectedStickerId: null,
    });
  },
  
  // Sticker actions
  addSticker: (uri: string) => {
    const newSticker: Sticker = {
      id: `sticker_${Date.now()}`,
      uri,
      position: { 
        x: get().canvasSize.width / 2, 
        y: get().canvasSize.height / 2 
      },
      scale: 1,
      rotation: 0,
    };
    
    set(state => ({
      stickers: [...state.stickers, newSticker],
      selectedStickerId: newSticker.id,
    }));
    get().saveToHistory();
  },
  
  updateSticker: (id: string, updates: Partial<Sticker>) => {
    set(state => ({
      stickers: state.stickers.map(sticker =>
        sticker.id === id ? { ...sticker, ...updates } : sticker
      ),
    }));
    get().saveToHistory();
  },
  
  removeSticker: (id: string) => {
    set(state => ({
      stickers: state.stickers.filter(sticker => sticker.id !== id),
      selectedStickerId: state.selectedStickerId === id ? null : state.selectedStickerId,
    }));
    get().saveToHistory();
  },
  
  selectSticker: (id: string | null) => {
    set({ 
      selectedStickerId: id,
      selectedTextId: null,
    });
  },
  
  // Audio actions
  setMusic: (track: AudioTrack | null) => {
    set({ music: track });
    get().saveToHistory();
  },
  
  // Frame actions
  setFrame: (frame: FrameStyle | null) => {
    set({ frame });
    get().saveToHistory();
  },
  
  // History actions
  saveToHistory: () => {
    const state = get();
    const currentState: EditorState = {
      beforeImage: state.beforeImage,
      afterImage: state.afterImage,
      transition: state.transition,
      textOverlays: state.textOverlays,
      stickers: state.stickers,
      music: state.music,
      frame: state.frame,
      canvasSize: state.canvasSize,
    };
    
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(currentState);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
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
      const newIndex = state.historyIndex - 1;
      const previousState = state.history[newIndex];
      
      set({
        ...previousState,
        historyIndex: newIndex,
        selectedTextId: null,
        selectedStickerId: null,
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
        historyIndex: newIndex,
        selectedTextId: null,
        selectedStickerId: null,
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
  
  // Reset
  reset: () => {
    set({
      ...initialState,
      activeTab: 'transition',
      isPreviewMode: false,
      isLoading: false,
      selectedTextId: null,
      selectedStickerId: null,
      history: [initialState],
      historyIndex: 0,
    });
  },
  
  // Export state
  getExportState: () => {
    const state = get();
    return {
      beforeImage: state.beforeImage,
      afterImage: state.afterImage,
      transition: state.transition,
      textOverlays: state.textOverlays,
      stickers: state.stickers,
      music: state.music,
      frame: state.frame,
      canvasSize: state.canvasSize,
    };
  },
}));