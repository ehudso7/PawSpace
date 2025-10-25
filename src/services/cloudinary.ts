import { API_BASE_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, hasServer } from '../config/env';

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

export type VideoJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface VideoRequestPayload {
  beforePublicId: string;
  afterPublicId: string;
  transitionMs?: number; // default 700ms
  durationMs?: number; // total output duration, default 2500ms
  hasMusic?: boolean;
}

export interface VideoJobResponse {
  jobId: string;
  publicId?: string; // optional if assigned at request time
}

export interface VideoStatusResponse {
  status: VideoJobStatus;
  url?: string; // secure URL when completed
  error?: string;
}

export interface GifRequestResponse {
  url: string; // secure URL to the generated GIF
}

export class CloudinaryClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CloudinaryClientError';
  }
}

function assertConfig() {
  if (!CLOUDINARY_CLOUD_NAME) throw new CloudinaryClientError('Missing CLOUDINARY_CLOUD_NAME');
  if (!CLOUDINARY_UPLOAD_PRESET) throw new CloudinaryClientError('Missing CLOUDINARY_UPLOAD_PRESET');
}

export async function uploadImage(localUri: string, abortSignal?: AbortSignal): Promise<CloudinaryUploadResponse> {
  assertConfig();

  const form = new FormData();
  // React Native FormData requires file-like object
  form.append('file', {
    // @ts-expect-error - React Native FormData file shape
    uri: localUri,
    name: 'upload.jpg',
    type: 'image/jpeg',
  });
  form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const res = await fetch(endpoint, {
    method: 'POST',
    body: form as any,
    signal: abortSignal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new CloudinaryClientError(`Image upload failed (${res.status}): ${text}`);
  }
  return (await res.json()) as CloudinaryUploadResponse;
}

// The following methods assume you have a backend that performs secure Cloudinary transformations
// and long-running jobs on your behalf. They are intentionally server-backed to avoid exposing secrets.

async function postJson<T>(path: string, body: unknown, abortSignal?: AbortSignal): Promise<T> {
  if (!hasServer) throw new CloudinaryClientError('Missing API_BASE_URL for server-backed Cloudinary operations');
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: abortSignal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new CloudinaryClientError(`POST ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

async function getJson<T>(path: string, abortSignal?: AbortSignal): Promise<T> {
  if (!hasServer) throw new CloudinaryClientError('Missing API_BASE_URL for server-backed Cloudinary operations');
  const res = await fetch(`${API_BASE_URL}${path}`, { method: 'GET', signal: abortSignal });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new CloudinaryClientError(`GET ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

export async function requestVideoCrossfade(payload: VideoRequestPayload, abortSignal?: AbortSignal): Promise<VideoJobResponse> {
  return postJson<VideoJobResponse>('/transformations/video/request', payload, abortSignal);
}

export async function pollVideoStatus(jobId: string, abortSignal?: AbortSignal): Promise<VideoStatusResponse> {
  return getJson<VideoStatusResponse>(`/transformations/video/status/${encodeURIComponent(jobId)}`, abortSignal);
}

export async function generateGifFromFrames(framesBase64: string[], abortSignal?: AbortSignal): Promise<GifRequestResponse> {
  return postJson<GifRequestResponse>('/transformations/gif/generate', { framesBase64 }, abortSignal);
}
