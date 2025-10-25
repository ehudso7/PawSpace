// App constants
export const APP_NAME = 'PawSpace';
export const APP_VERSION = '1.0.0';

// Video constants
export const MAX_VIDEO_DURATION = 30; // seconds
export const MIN_VIDEO_DURATION = 1; // seconds
export const DEFAULT_VIDEO_FPS = 30;
export const DEFAULT_VIDEO_QUALITY = 'auto';

// Social media constants
export const PLATFORM_CAPTION_LIMITS = {
  pawspace: 280,
  instagram: 2200,
  tiktok: 300,
  twitter: 280
} as const;

export const DEFAULT_HASHTAGS = [
  'petgrooming',
  'doggrooming',
  'petcare',
  'transformation',
  'pawspace'
];

// File size limits (in bytes)
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

// UI constants
export const COLORS = {
  primary: '#4CAF50',
  secondary: '#2196F3',
  accent: '#FF9800',
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0'
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
} as const;