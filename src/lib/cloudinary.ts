import * as FileSystem from 'expo-file-system';
import { getCloudinaryConfig, cloudinaryUrls } from '../config/cloudinary';

export interface UploadProgress {
  bytesSent: number;
  totalBytesSent: number;
  totalBytesExpectedToSend: number;
}

export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  version_id?: string;
  signature?: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: 'image' | 'video' | 'raw';
  created_at: string;
  tags?: string[];
  pages?: number;
  bytes: number;
  type: string;
  etag?: string;
  placeholder?: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}

export type TransitionType = 'crossfade' | 'slide' | 'zoom' | 'none';

export interface GenerateVideoOptions {
  beforePublicId: string;
  afterPublicId: string;
  width?: number;
  height?: number;
  transition?: TransitionType;
  durationSeconds?: number; // total duration
  musicPublicId?: string; // optional music track in Cloudinary
  publicId?: string; // desired output public id
}

export const uploadImage = async (
  fileUri: string,
  opts?: {
    folder?: string;
    onProgress?: (p: UploadProgress) => void;
  }
): Promise<CloudinaryUploadResult> => {
  const { uploadPreset, assetFolder } = getCloudinaryConfig();
  const { upload } = cloudinaryUrls();

  if (!uploadPreset) {
    throw new Error('Cloudinary unsigned upload preset is required for client uploads.');
  }

  const form = new FormData();
  form.append('file', {
    uri: fileUri,
    name: 'upload.jpg',
    type: 'image/jpeg',
  } as any);
  form.append('upload_preset', uploadPreset);
  if (opts?.folder || assetFolder) {
    form.append('folder', opts?.folder ?? assetFolder ?? '');
  }

  // Use FileSystem.createUploadTask to get progress callbacks in Expo
  const uploadTask = FileSystem.createUploadTask(
    upload,
    fileUri,
    {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      parameters: {
        upload_preset: uploadPreset,
        ...(opts?.folder || assetFolder ? { folder: opts?.folder ?? assetFolder! } : {}),
      },
      headers: { 'Accept': 'application/json' },
    },
    opts?.onProgress
  );

  const resp = await uploadTask.uploadAsync();
  if (!resp || !resp.body) throw new Error('Cloudinary upload failed: empty response');

  let json: CloudinaryUploadResult;
  try {
    json = JSON.parse(resp.body);
  } catch (e) {
    throw new Error(`Cloudinary upload parse error: ${(e as Error).message}`);
  }

  if ((json as any).error) {
    const err = (json as any).error;
    throw new Error(`Cloudinary upload error: ${err.message || JSON.stringify(err)}`);
  }

  return json;
};

// Poll by HEADing the resource URL until it exists (no admin auth required)
export const pollAssetReady = async (
  publicId: string,
  resourceType: 'video' | 'image',
  format: 'mp4' | 'gif' | 'jpg' = resourceType === 'video' ? 'mp4' : 'jpg',
  opts?: { timeoutMs?: number; intervalMs?: number }
): Promise<string> => {
  const { res } = cloudinaryUrls();
  const path = `${resourceType}/upload/${publicId}.${format}`;
  const url = res(path);
  const timeoutAt = Date.now() + (opts?.timeoutMs ?? 90_000);
  const interval = opts?.intervalMs ?? 2000;

  while (Date.now() < timeoutAt) {
    try {
      const head = await fetch(url, { method: 'HEAD' });
      if (head.ok) return url;
    } catch {
      // ignore and retry
    }
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error('Timed out waiting for Cloudinary asset readiness');
};

// Create a slideshow video on Cloudinary (requires server signature; we call a backend endpoint)
export const requestSlideshowVideo = async (
  params: GenerateVideoOptions
): Promise<{ publicId: string } | null> => {
  const { signingEndpoint } = getCloudinaryConfig();
  if (!signingEndpoint) return null; // not configured

  const resp = await fetch(`${signingEndpoint.replace(/\/$/, '')}/cloudinary/create-slideshow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Slideshow request failed: ${resp.status} ${text}`);
  }
  const json = await resp.json();
  return { publicId: json.public_id || json.publicId };
};

// Build a simple crossfade transformation URL for a video generated from two images (best-effort)
export const buildCrossfadeTransformationUrl = (
  beforePublicId: string,
  afterPublicId: string,
  opts?: { width?: number; height?: number; durationSeconds?: number; format?: 'mp4' | 'gif' }
): string => {
  const { res } = cloudinaryUrls();
  const width = opts?.width ?? 720;
  const height = opts?.height ?? 1280;
  const duration = opts?.durationSeconds ?? 3;
  const format = opts?.format ?? 'mp4';

  // This uses Cloudinary's slideshow effect shortcut via fetch URL. Note: For production, prefer signed slideshow API.
  const base = `video/upload/e_slideshow:w_${width},h_${height},du_${duration},dl_100,l_${encodeURIComponent(
    beforePublicId
  )}/l_${encodeURIComponent(afterPublicId)}/vs_0`;
  return res(`${base}.${format}`);
};
