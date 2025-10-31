import { CloudinaryConfig } from '../types';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET;

if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME.includes('your')) {
  console.warn('?? Cloudinary cloud name not configured. Image upload features will not work.');
}

export const cloudinaryConfig: CloudinaryConfig = {
  cloud_name: CLOUDINARY_CLOUD_NAME || '',
  api_key: CLOUDINARY_API_KEY || '',
  api_secret: CLOUDINARY_API_SECRET || '',
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