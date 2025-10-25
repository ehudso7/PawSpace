import { CreateTransformationData, DraftData, Transformation } from '../types/transformations';

const API_BASE = (process as any)?.env?.EXPO_PUBLIC_API_BASE_URL || (process as any)?.env?.API_BASE_URL || '';

const api = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!API_BASE) throw new Error('API base URL not configured');
  const res = await fetch(`${API_BASE.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    let msg: string;
    try { msg = (await res.json()).message; } catch { msg = await res.text(); }
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.status === 204 ? (undefined as unknown as T) : (await res.json());
};

export const transformationsService = {
  async createTransformation(data: CreateTransformationData): Promise<Transformation> {
    return api<Transformation>('/transformations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async saveDraft(data: DraftData): Promise<void> {
    await api<void>('/transformations/draft', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyTransformations(): Promise<Transformation[]> {
    return api<Transformation[]>('/transformations/me');
  },

  async deleteTransformation(id: string): Promise<void> {
    await api<void>(`/transformations/${id}`, { method: 'DELETE' });
  },

  async shareToSocial(transformationId: string, platform: 'instagram' | 'tiktok'): Promise<void> {
    await api<void>(`/transformations/${transformationId}/share`, {
      method: 'POST',
      body: JSON.stringify({ platform }),
    });
  },
};
