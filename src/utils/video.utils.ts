/**
 * Video Utilities
 * Helper functions for video processing
 */

import { Platform } from 'react-native';

/**
 * Get optimal video quality settings based on device
 */
export const getOptimalVideoSettings = () => {
  const isLowEndDevice = Platform.OS === 'android' && Platform.Version < 28;

  return {
    fps: isLowEndDevice ? 24 : 30,
    quality: isLowEndDevice ? 'medium' : 'high',
    maxDuration: isLowEndDevice ? 10 : 30,
    resolution: isLowEndDevice ? '720p' : '1080p',
  };
};

/**
 * Calculate video file size estimate
 */
export const estimateVideoSize = (
  duration: number,
  fps: number,
  resolution: '720p' | '1080p' | '4k'
): number => {
  // Rough estimates in MB
  const bitrateMap = {
    '720p': 5, // ~5 Mbps
    '1080p': 8, // ~8 Mbps
    '4k': 45, // ~45 Mbps
  };

  const bitrate = bitrateMap[resolution];
  const sizeInMB = (bitrate * duration) / 8;
  
  return Math.round(sizeInMB * 100) / 100;
};

/**
 * Format video duration
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  return `${secs}s`;
};

/**
 * Validate video URL
 */
export const isValidVideoUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const validExtensions = ['.mp4', '.mov', '.avi', '.webm'];
    return validExtensions.some(ext => 
      urlObj.pathname.toLowerCase().endsWith(ext)
    );
  } catch {
    return false;
  }
};

/**
 * Get video thumbnail timestamp
 */
export const getThumbnailTimestamp = (duration: number): number => {
  // Get thumbnail at 30% of video duration
  return Math.floor(duration * 0.3);
};

/**
 * Compress image before upload
 */
export const compressImageForVideo = async (
  uri: string,
  quality: number = 0.8
): Promise<string> => {
  // This would typically use an image manipulation library
  // like expo-image-manipulator
  return uri; // Return as-is for now
};

/**
 * Generate unique video ID
 */
export const generateVideoId = (): string => {
  return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if device has enough storage
 */
export const hasEnoughStorage = async (
  requiredMB: number
): Promise<boolean> => {
  // This would use a native module to check available storage
  // For now, return true
  return true;
};

/**
 * Get recommended hashtags based on image analysis
 */
export const getRecommendedHashtags = (
  beforeImageUrl: string,
  afterImageUrl: string
): string[] => {
  // In production, this would use AI/ML to analyze images
  // and suggest relevant hashtags
  return [
    '#petgrooming',
    '#beforeandafter',
    '#transformation',
    '#dogsofinstagram',
  ];
};

/**
 * Sanitize caption text
 */
export const sanitizeCaption = (caption: string): string => {
  return caption
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .slice(0, 280); // Enforce character limit
};

/**
 * Generate share text
 */
export const generateShareText = (
  caption: string,
  hashtags: string[],
  provider?: { name: string; link: string }
): string => {
  let text = caption;

  if (provider) {
    text += `\n\n✨ Groomed by ${provider.name}`;
  }

  const hashtagString = hashtags
    .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
    .join(' ');

  text += `\n\n${hashtagString}`;

  return text;
};

/**
 * Check video orientation
 */
export const getVideoOrientation = (
  width: number,
  height: number
): 'portrait' | 'landscape' | 'square' => {
  const ratio = width / height;

  if (ratio > 1.1) return 'landscape';
  if (ratio < 0.9) return 'portrait';
  return 'square';
};

/**
 * Get optimal text overlay position based on image content
 */
export const getOptimalTextPosition = (
  imageUrl: string
): 'top' | 'center' | 'bottom' => {
  // In production, this would analyze image to find best text placement
  // For now, default to top
  return 'top';
};
