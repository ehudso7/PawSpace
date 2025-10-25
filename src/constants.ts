/**
 * Constants for the Transformation Creator
 * Customize these values to match your app's branding and requirements
 */

// Brand Colors
export const COLORS = {
  primary: '#6B4EFF',
  secondary: '#4ECDC4',
  accent: '#FF6B6B',
  success: '#4CAF50',
  warning: '#FFA07A',
  error: '#FF3B30',
  
  text: {
    primary: '#000000',
    secondary: '#666666',
    light: '#999999',
    white: '#FFFFFF',
  },
  
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    dark: '#000000',
    border: '#E5E5E5',
  },
} as const;

// Image Requirements
export const IMAGE_CONSTRAINTS = {
  minWidth: 800,
  minHeight: 800,
  maxWidth: 4096,
  maxHeight: 4096,
  compressionQuality: 0.8,
  aspectRatio: [1, 1] as [number, number],
} as const;

// Text Overlay Constraints
export const TEXT_CONSTRAINTS = {
  minSize: 12,
  maxSize: 72,
  defaultSize: 24,
  defaultColor: '#FFFFFF',
  defaultFont: 'System',
} as const;

// Sticker Constraints
export const STICKER_CONSTRAINTS = {
  minScale: 0.5,
  maxScale: 3,
  defaultScale: 1,
  defaultSize: 100,
} as const;

// Editor Settings
export const EDITOR_SETTINGS = {
  historyLimit: 20,
  previewHeight: 0.6, // 60% of screen
  toolbarHeight: 0.4, // 40% of screen
  defaultTransition: 'fade' as const,
  transitionDuration: 2000, // milliseconds
  autoSaveDraftInterval: 30000, // 30 seconds (set to 0 to disable)
} as const;

// Animation Settings
export const ANIMATION_SETTINGS = {
  springConfig: {
    damping: 15,
    mass: 1,
    stiffness: 150,
  },
  timingConfig: {
    duration: 300,
  },
} as const;

// Audio Settings
export const AUDIO_SETTINGS = {
  defaultVolume: 0.8,
  minVolume: 0,
  maxVolume: 1,
  trackDuration: 15, // seconds
} as const;

// Frame Settings
export const FRAME_SETTINGS = {
  defaultWidth: 4,
  widthOptions: [2, 4, 6, 8, 10, 12],
  defaultColor: '#FFFFFF',
} as const;

// UI Dimensions
export const UI_DIMENSIONS = {
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 24,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  iconSize: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 32,
  },
} as const;

// Sticker Categories
export const STICKER_CATEGORIES = [
  { id: 'all', name: 'All', icon: 'apps' },
  { id: 'paws', name: 'Paws', icon: 'paw' },
  { id: 'hearts', name: 'Hearts', icon: 'heart' },
  { id: 'stars', name: 'Stars', icon: 'star' },
  { id: 'effects', name: 'Effects', icon: 'sparkles' },
  { id: 'achievements', name: 'Achievements', icon: 'trophy' },
  { id: 'emotions', name: 'Emotions', icon: 'happy' },
  { id: 'grooming', name: 'Grooming', icon: 'cut' },
] as const;

// Messages
export const MESSAGES = {
  imageSelector: {
    title: 'Create a transformation to showcase your pet care work',
    subtitle: 'Upload before and after photos',
    requirements: 'Best quality: Square images, minimum 800x800px',
    imageToSmall: 'Please select an image that is at least 800x800 pixels for best quality.',
    processingError: 'Failed to process image. Please try another image.',
    permissionRequired: 'Please grant camera and photo library permissions to upload images.',
  },
  editor: {
    addText: 'Double tap to edit',
    textHint: 'Tap text on the preview to select, drag to move, pinch to rotate',
    stickerHint: 'Tap a sticker to add it to your image',
    musicHint: 'Tap to select, tap play button to preview',
    frameHint: 'Select a frame style to add borders to your transformation',
  },
} as const;

// Export type for TypeScript
export type ColorScheme = typeof COLORS;
export type ImageConstraints = typeof IMAGE_CONSTRAINTS;
export type TextConstraints = typeof TEXT_CONSTRAINTS;
export type EditorSettings = typeof EDITOR_SETTINGS;
