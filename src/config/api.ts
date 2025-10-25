export const API_BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';

export function getApiUrl(path: string): string {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
}
