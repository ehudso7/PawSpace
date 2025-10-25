export const API_BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_12345';
export const MERCHANT_DISPLAY_NAME = process.env.MERCHANT_DISPLAY_NAME || 'PawSpace';
export const PLATFORM_FEE_PERCENT = 0.1; // 10%

export function buildMapsUrl(address: string): string {
  const encoded = encodeURIComponent(address);
  return `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
}
