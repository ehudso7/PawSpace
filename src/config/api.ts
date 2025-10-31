import { getApiUrl as getApiUrlFromConfig, APP_CONFIG } from './appConfig';

export const API_BASE_URL = APP_CONFIG.api.baseUrl;

export function getApiUrl(path: string): string {
  return getApiUrlFromConfig(path);
}
