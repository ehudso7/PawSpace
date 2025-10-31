import { APP_CONFIG } from './config/appConfig';

// Export for backward compatibility
export const API_BASE_URL = APP_CONFIG.api.baseUrl;
export const STRIPE_PUBLISHABLE_KEY = APP_CONFIG.stripe.publishableKey;
export const MERCHANT_DISPLAY_NAME = 'PawSpace';
export const PLATFORM_FEE_PERCENT = 0.1; // 10%

export function buildMapsUrl(address: string): string {
  const encoded = encodeURIComponent(address);
  return `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
}
