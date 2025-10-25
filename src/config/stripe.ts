import { STRIPE_MERCHANT_DISPLAY_NAME } from './env';

export const merchantDisplayName = STRIPE_MERCHANT_DISPLAY_NAME;

export const platformFeeRate = 0.1; // 10%

export function calculatePriceBreakdown(servicePrice: number): {
  platformFee: number;
  total: number;
} {
  const platformFee = Math.round((servicePrice * platformFeeRate) * 100) / 100;
  const total = Math.round((servicePrice + platformFee) * 100) / 100;
  return { platformFee, total };
}
