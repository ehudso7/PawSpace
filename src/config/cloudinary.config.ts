/**
 * Environment Configuration
 * Set up your Cloudinary credentials here
 */

export const CLOUDINARY_CONFIG = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',
};

// Note: In production, use environment variables
// For development, you can set these directly or use a .env file
