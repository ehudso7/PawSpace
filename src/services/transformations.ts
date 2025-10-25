import { API_BASE_URL } from '../config/env';
import { CreateTransformationData, DraftData, SharePlatform, Transformation } from '../types/transformations';

class TransformationsServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransformationsServiceError';
  }
}

async function postJson<T>(path: string, body: unknown, abortSignal?: AbortSignal): Promise<T> {
  if (!API_BASE_URL) throw new TransformationsServiceError('Missing API_BASE_URL');
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: abortSignal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new TransformationsServiceError(`POST ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

async function getJson<T>(path: string, abortSignal?: AbortSignal): Promise<T> {
  if (!API_BASE_URL) throw new TransformationsServiceError('Missing API_BASE_URL');
  const res = await fetch(`${API_BASE_URL}${path}`, { method: 'GET', signal: abortSignal });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new TransformationsServiceError(`GET ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

async function del(path: string, abortSignal?: AbortSignal): Promise<void> {
  if (!API_BASE_URL) throw new TransformationsServiceError('Missing API_BASE_URL');
  const res = await fetch(`${API_BASE_URL}${path}`, { method: 'DELETE', signal: abortSignal });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new TransformationsServiceError(`DELETE ${path} failed (${res.status}): ${text}`);
  }
}

export const TransformationsService = {
  // Post transformation to feed
  async createTransformation(data: CreateTransformationData, abortSignal?: AbortSignal): Promise<Transformation> {
    return postJson<Transformation>('/transformations', data, abortSignal);
  },

  // Save draft
  async saveDraft(data: DraftData, abortSignal?: AbortSignal): Promise<void> {
    await postJson<unknown>('/transformations/draft', data, abortSignal);
  },

  // Get my transformations
  async getMyTransformations(abortSignal?: AbortSignal): Promise<Transformation[]> {
    return getJson<Transformation[]>('/transformations/me', abortSignal);
  },

  // Delete transformation
  async deleteTransformation(id: string, abortSignal?: AbortSignal): Promise<void> {
    await del(`/transformations/${encodeURIComponent(id)}`, abortSignal);
  },

  // Share to social media (server may prepare shareable assets/links if needed)
  async shareToSocial(transformationId: string, platform: SharePlatform, abortSignal?: AbortSignal): Promise<void> {
    await postJson<unknown>(`/transformations/${encodeURIComponent(transformationId)}/share`, { platform }, abortSignal);
  },
};
