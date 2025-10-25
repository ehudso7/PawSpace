import { CloudinaryConfig } from '../types';

// Cloudinary configuration
// In production, these should be environment variables
export const cloudinaryConfig: CloudinaryConfig = {
  cloud_name: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET || 'your-api-secret'
};

// Validate configuration
export const validateCloudinaryConfig = (): boolean => {
  return !!(
    cloudinaryConfig.cloud_name &&
    cloudinaryConfig.api_key &&
    cloudinaryConfig.api_secret &&
    cloudinaryConfig.cloud_name !== 'your-cloud-name'
  );
};

// Default video generation parameters
export const defaultVideoParams = {
  duration: 3, // seconds
  fps: 30,
  transition: 'fade' as const,
  textOverlays: []
};