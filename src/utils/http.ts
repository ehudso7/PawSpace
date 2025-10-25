import { getApiUrl } from '../config/api';

export interface HttpErrorShape {
  status: number;
  message: string;
  details?: unknown;
}

export class HttpError extends Error implements HttpErrorShape {
  status: number;
  details?: unknown;

  constructor({ status, message, details }: HttpErrorShape) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function getAuthToken(): Promise<string | undefined> {
  return process.env.API_AUTH_TOKEN;
}

export async function http<T>(
  path: string,
  options: RequestInit & { parse?: 'json' | 'text' } = {}
): Promise<T> {
  const token = await getAuthToken();
  const url = getApiUrl(path);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const isJson = (options.parse ?? 'json') === 'json';

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    let details: unknown;
    try {
      details = await response.json();
      if ((details as any)?.message) {
        message = (details as any).message;
      }
    } catch (_) {
      // ignore
    }
    throw new HttpError({ status: response.status, message, details });
  }

  if (isJson) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}
