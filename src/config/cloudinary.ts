export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset?: string; // Unsigned upload preset for client-side uploads
  apiKey?: string; // Only used for signed ops via a backend
  signingEndpoint?: string; // Your backend endpoint to sign/passthrough admin/generate requests
  assetFolder?: string; // Optional folder to organize assets
}

const readEnv = (key: string | undefined, fallback?: string): string | undefined => {
  if (typeof key === 'string' && key.length > 0) return key;
  if (typeof fallback === 'string') return fallback;
  return undefined;
};

export const getCloudinaryConfig = (): CloudinaryConfig => {
  // Prefer Expo public envs when available
  const cloudName =
    readEnv((process as any)?.env?.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME) ||
    readEnv((process as any)?.env?.CLOUDINARY_CLOUD_NAME) ||
    '';

  const uploadPreset =
    readEnv((process as any)?.env?.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET) ||
    readEnv((process as any)?.env?.CLOUDINARY_UPLOAD_PRESET);

  const apiKey =
    readEnv((process as any)?.env?.EXPO_PUBLIC_CLOUDINARY_API_KEY) ||
    readEnv((process as any)?.env?.CLOUDINARY_API_KEY);

  const signingEndpoint =
    readEnv((process as any)?.env?.EXPO_PUBLIC_CLOUDINARY_SIGNING_ENDPOINT) ||
    readEnv((process as any)?.env?.CLOUDINARY_SIGNING_ENDPOINT);

  const assetFolder =
    readEnv((process as any)?.env?.EXPO_PUBLIC_CLOUDINARY_ASSET_FOLDER) ||
    readEnv((process as any)?.env?.CLOUDINARY_ASSET_FOLDER);

  if (!cloudName) {
    throw new Error('Cloudinary cloud name is required. Set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME.');
  }

  return { cloudName, uploadPreset, apiKey, signingEndpoint, assetFolder };
};

export const cloudinaryUrls = () => {
  const { cloudName } = getCloudinaryConfig();
  return {
    upload: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    uploadVideo: `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    createSlideshow: `https://api.cloudinary.com/v1_1/${cloudName}/video/create_slideshow`,
    res: (path: string) => `https://res.cloudinary.com/${cloudName}/${path}`,
  };
};
