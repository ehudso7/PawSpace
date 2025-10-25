// Environment configuration loader for Expo or bare React Native
// Reads from expo-constants extra (preferred) or process.env fallbacks

export type EnvExtra = {
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_UPLOAD_PRESET?: string;
  API_BASE_URL?: string; // Your app backend base URL (handles Cloudinary secure ops)
  CLOUDINARY_API_KEY?: string; // Avoid using on-device; dev only
  CLOUDINARY_API_SECRET?: string; // Avoid using on-device; dev only
};

function readExpoExtra(): EnvExtra {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Constants = require('expo-constants').default;
    const extra = (Constants.expoConfig?.extra || Constants.manifest?.extra || {}) as EnvExtra;
    return extra ?? {};
  } catch {
    return {};
  }
}

const extra = readExpoExtra();

export const CLOUDINARY_CLOUD_NAME =
  extra.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_UPLOAD_PRESET =
  extra.CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET || '';
export const API_BASE_URL = extra.API_BASE_URL || process.env.API_BASE_URL || '';

// These are intentionally not used by default on-device. Prefer server-side signing.
export const CLOUDINARY_API_KEY = extra.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET =
  extra.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET || '';

export const hasServer = Boolean(API_BASE_URL);
