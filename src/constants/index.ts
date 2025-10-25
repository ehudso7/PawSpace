/**
 * Constants and Configuration
 */

// Video Settings
export const VIDEO_SETTINGS = {
  MIN_DURATION: 3,
  MAX_DURATION: 30,
  DEFAULT_DURATION: 6,
  MIN_FPS: 24,
  MAX_FPS: 60,
  DEFAULT_FPS: 30,
  SUPPORTED_FORMATS: ['mp4', 'mov', 'webm'] as const,
};

// Text Overlay Settings
export const TEXT_OVERLAY_SETTINGS = {
  MIN_FONT_SIZE: 20,
  MAX_FONT_SIZE: 100,
  DEFAULT_FONT_SIZE: 40,
  DEFAULT_COLOR: 'white',
  DEFAULT_FONT_FAMILY: 'Arial',
  SUPPORTED_POSITIONS: ['top', 'center', 'bottom'] as const,
};

// Transition Types
export const TRANSITION_TYPES = [
  { value: 'fade', label: 'Fade', description: 'Smooth fade transition' },
  { value: 'slide', label: 'Slide', description: 'Slide from side' },
  { value: 'zoom', label: 'Zoom', description: 'Zoom in/out effect' },
  { value: 'dissolve', label: 'Dissolve', description: 'Dissolve effect' },
  { value: 'wipe', label: 'Wipe', description: 'Wipe from side' },
  { value: 'none', label: 'None', description: 'No transition' },
] as const;

// Caption Settings
export const CAPTION_SETTINGS = {
  MAX_LENGTH: 280,
  MIN_LENGTH: 0,
  PLACEHOLDER: 'Share your pet\'s transformation story...',
};

// Hashtag Settings
export const HASHTAG_SETTINGS = {
  MAX_HASHTAGS: 30,
  MIN_LENGTH: 2,
  MAX_LENGTH: 30,
  SUGGESTED: [
    '#petgrooming',
    '#doggrooming',
    '#catsofinstagram',
    '#dogsofinstagram',
    '#pettransformation',
    '#beforeandafter',
    '#grooming',
    '#petcare',
    '#dogmakeover',
    '#groomingsalon',
    '#petstyling',
    '#fluffypuppy',
    '#groominglife',
    '#petlove',
    '#furbaby',
  ],
};

// Platform-Specific Settings
export const PLATFORM_SETTINGS = {
  instagram: {
    maxDuration: 90,
    minDuration: 3,
    aspectRatio: [9, 16], // Portrait
    urlScheme: 'instagram://library',
  },
  tiktok: {
    maxDuration: 60,
    minDuration: 3,
    aspectRatio: [9, 16], // Portrait
    urlScheme: {
      ios: 'tiktok://share',
      android: 'snssdk1128://share',
    },
  },
  facebook: {
    maxDuration: 240,
    minDuration: 1,
    aspectRatio: [16, 9], // Landscape
  },
  twitter: {
    maxDuration: 140,
    minDuration: 0.5,
    aspectRatio: [16, 9],
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  VIDEO_GENERATION_FAILED: 'Failed to generate video. Please try again.',
  UPLOAD_FAILED: 'Failed to upload image. Please check your connection.',
  SAVE_FAILED: 'Failed to save video to device. Please check permissions.',
  SHARE_FAILED: 'Failed to share video. Please try again.',
  PERMISSION_DENIED: 'Permission denied. Please enable permissions in settings.',
  INVALID_IMAGE: 'Invalid image format. Please use JPG, PNG, or WebP.',
  INVALID_VIDEO: 'Invalid video format. Please use MP4, MOV, or WebM.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  CLOUDINARY_NOT_INITIALIZED: 'Cloudinary service not initialized.',
  INVALID_DURATION: 'Duration must be between 3 and 30 seconds.',
  CAPTION_TOO_LONG: 'Caption must be 280 characters or less.',
  NO_IMAGES_PROVIDED: 'Please provide before and after images.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  VIDEO_GENERATED: 'Video generated successfully!',
  VIDEO_SAVED: 'Video saved to your device!',
  VIDEO_SHARED: 'Video shared successfully!',
  POST_PUBLISHED: 'Your transformation has been posted!',
  DRAFT_SAVED: 'Draft saved successfully!',
};

// Loading Messages
export const LOADING_MESSAGES = {
  GENERATING_VIDEO: 'Generating your transformation video...',
  UPLOADING_IMAGES: 'Uploading images...',
  SAVING_VIDEO: 'Saving video to device...',
  SHARING_VIDEO: 'Preparing to share...',
  PUBLISHING_POST: 'Publishing your post...',
};

// Colors
export const COLORS = {
  primary: '#4CAF50',
  secondary: '#2196F3',
  accent: '#FF9800',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#999999',
    white: '#FFFFFF',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    dark: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#757575',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  PUBLISH_VIDEO: '/v1/posts/video',
  GET_USER_VIDEOS: '/v1/users/:userId/videos',
  DELETE_POST: '/v1/posts/:postId',
  UPDATE_PRIVACY: '/v1/posts/:postId/privacy',
  GET_HASHTAG_SUGGESTIONS: '/v1/hashtags/suggestions',
  UPLOAD_IMAGE: '/v1/media/image',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@pawspace/auth_token',
  USER_PREFERENCES: '@pawspace/user_preferences',
  DRAFT_VIDEOS: '@pawspace/draft_videos',
  CACHED_VIDEOS: '@pawspace/cached_videos',
  CLOUDINARY_CONFIG: '@pawspace/cloudinary_config',
};

// Feature Flags
export const FEATURES = {
  ENABLE_VIDEO_EFFECTS: true,
  ENABLE_AUDIO_TRACKS: true,
  ENABLE_DRAFTS: true,
  ENABLE_SCHEDULED_POSTS: false,
  ENABLE_ANALYTICS: true,
  ENABLE_ADVANCED_EDITING: false,
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  VIDEO_GENERATED: 'video_generated',
  VIDEO_SAVED: 'video_saved',
  VIDEO_SHARED: 'video_shared',
  POST_PUBLISHED: 'post_published',
  PREVIEW_OPENED: 'preview_opened',
  BOTTOM_SHEET_OPENED: 'bottom_sheet_opened',
  HASHTAG_SELECTED: 'hashtag_selected',
  TRANSITION_CHANGED: 'transition_changed',
};
