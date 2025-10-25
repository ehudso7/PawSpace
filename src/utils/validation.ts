import { Platform } from '../types';
import { PLATFORM_CAPTION_LIMITS, MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from '../constants';

/**
 * Validate image file
 */
export const validateImageFile = (uri: string, size?: number): { isValid: boolean; error?: string } => {
  // Check file extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const hasValidExtension = validExtensions.some(ext => 
    uri.toLowerCase().includes(ext)
  );

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: 'Invalid image format. Please use JPG, PNG, GIF, or WebP.'
    };
  }

  // Check file size if provided
  if (size && size > MAX_IMAGE_SIZE) {
    return {
      isValid: false,
      error: `Image too large. Maximum size is ${Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB.`
    };
  }

  return { isValid: true };
};

/**
 * Validate video file
 */
export const validateVideoFile = (uri: string, size?: number): { isValid: boolean; error?: string } => {
  // Check file extension
  const validExtensions = ['.mp4', '.mov', '.avi', '.webm'];
  const hasValidExtension = validExtensions.some(ext => 
    uri.toLowerCase().includes(ext)
  );

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: 'Invalid video format. Please use MP4, MOV, AVI, or WebM.'
    };
  }

  // Check file size if provided
  if (size && size > MAX_VIDEO_SIZE) {
    return {
      isValid: false,
      error: `Video too large. Maximum size is ${Math.round(MAX_VIDEO_SIZE / (1024 * 1024))}MB.`
    };
  }

  return { isValid: true };
};

/**
 * Validate caption for specific platform
 */
export const validateCaption = (caption: string, platform: Platform): { isValid: boolean; error?: string } => {
  const limit = PLATFORM_CAPTION_LIMITS[platform];
  
  if (caption.length === 0) {
    return {
      isValid: false,
      error: 'Caption cannot be empty.'
    };
  }

  if (caption.length > limit) {
    return {
      isValid: false,
      error: `Caption too long for ${platform}. Maximum ${limit} characters, current: ${caption.length}.`
    };
  }

  return { isValid: true };
};

/**
 * Validate hashtags
 */
export const validateHashtags = (hashtags: string[]): { isValid: boolean; error?: string } => {
  if (hashtags.length === 0) {
    return { isValid: true }; // Hashtags are optional
  }

  if (hashtags.length > 30) {
    return {
      isValid: false,
      error: 'Too many hashtags. Maximum 30 allowed.'
    };
  }

  // Check individual hashtag format
  const hashtagRegex = /^[a-zA-Z0-9_]+$/;
  const invalidHashtags = hashtags.filter(tag => !hashtagRegex.test(tag));
  
  if (invalidHashtags.length > 0) {
    return {
      isValid: false,
      error: `Invalid hashtags: ${invalidHashtags.join(', ')}. Use only letters, numbers, and underscores.`
    };
  }

  return { isValid: true };
};

/**
 * Validate URL format
 */
export const validateUrl = (url: string): { isValid: boolean; error?: string } => {
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: 'Invalid URL format.'
    };
  }
};

/**
 * Sanitize filename for safe storage
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Format duration for display
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};