/**
 * Cloudinary Configuration
 * Configure Cloudinary API settings
 */

export const CLOUDINARY_CONFIG = {
  cloud_name: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || '',
  api_secret: process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET || '',
  upload_preset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'pawspace_transformations',
};

export const CLOUDINARY_URLS = {
  upload: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/upload`,
  video: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/video/upload`,
};

// Validate configuration
export const validateCloudinaryConfig = (): boolean => {
  if (!CLOUDINARY_CONFIG.cloud_name) {
    console.warn('Cloudinary cloud_name not configured');
    return false;
  }
  return true;
};
