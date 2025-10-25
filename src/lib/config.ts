export const Config = {
  // Mobile app: set via env or .env file and import into native config
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY || '',
  // Supabase Edge Functions base URL (e.g., https://<project>.functions.supabase.co)
  FUNCTIONS_BASE_URL: process.env.EXPO_PUBLIC_FUNCTIONS_BASE_URL || process.env.FUNCTIONS_BASE_URL || '',
  // Optional: Billing portal
  BILLING_PORTAL_RETURN_URL: process.env.EXPO_PUBLIC_BILLING_PORTAL_RETURN_URL || process.env.BILLING_PORTAL_RETURN_URL || 'pawspace://subscription',
};

export function getFunctionUrl(path: string): string {
  const base = Config.FUNCTIONS_BASE_URL?.replace(/\/$/, '') || '';
  if (!base) return path; // fallback to relative for dev proxy
  return `${base}/${path.replace(/^\//, '')}`;
}
