/**
 * Payment Utilities
 * Helper functions for payment processing
 */

import { PremiumFeature } from '../types/payment';

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Convert dollars to cents
 */
export const dollarsToCents = (dollars: number): number => {
  return Math.round(dollars * 100);
};

/**
 * Convert cents to dollars
 */
export const centsToDollars = (cents: number): number => {
  return cents / 100;
};

/**
 * Calculate marketplace commission
 */
export const calculateCommission = (
  amount: number, 
  commissionPercent: number = 10
): { amount: number; commission: number; providerReceives: number } => {
  const commission = amount * (commissionPercent / 100);
  const providerReceives = amount - commission;

  return {
    amount,
    commission,
    providerReceives,
  };
};

/**
 * Get feature display name
 */
export const getFeatureDisplayName = (feature: PremiumFeature): string => {
  const featureNames: Record<PremiumFeature, string> = {
    create_transformation: 'Create Transformations',
    export_without_watermark: 'Export Without Watermark',
    premium_stickers: 'Premium Stickers & Effects',
    featured_listing: 'Featured Provider Listing',
    advanced_analytics: 'Advanced Analytics',
    priority_support: 'Priority Support',
    ad_free: 'Ad-Free Experience',
  };

  return featureNames[feature] || feature;
};

/**
 * Check if trial is active
 */
export const isTrialActive = (trialEndsAt?: string): boolean => {
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt) > new Date();
};

/**
 * Check if subscription is expired
 */
export const isSubscriptionExpired = (expiresAt?: string): boolean => {
  if (!expiresAt) return true;
  return new Date(expiresAt) < new Date();
};

/**
 * Get days until expiration
 */
export const getDaysUntilExpiration = (expiresAt?: string): number => {
  if (!expiresAt) return 0;
  
  const now = new Date();
  const expires = new Date(expiresAt);
  const diffTime = expires.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

/**
 * Format date for display
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format relative time (e.g., "in 7 days", "2 days ago")
 */
export const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};

/**
 * Validate payment amount
 */
export const validatePaymentAmount = (
  amount: number,
  minAmount: number = 1,
  maxAmount: number = 10000
): { valid: boolean; error?: string } => {
  if (amount < minAmount) {
    return {
      valid: false,
      error: `Amount must be at least ${formatCurrency(minAmount)}`,
    };
  }
  
  if (amount > maxAmount) {
    return {
      valid: false,
      error: `Amount cannot exceed ${formatCurrency(maxAmount)}`,
    };
  }
  
  return { valid: true };
};

/**
 * Get subscription status color
 */
export const getSubscriptionStatusColor = (
  isPremium: boolean,
  isTrial: boolean
): string => {
  if (!isPremium) return '#999999'; // Gray for free
  if (isTrial) return '#22C55E'; // Green for trial
  return '#FFD700'; // Gold for premium
};

/**
 * Parse Stripe error
 */
export const parseStripeError = (error: any): string => {
  if (typeof error === 'string') return error;
  
  if (error?.message) return error.message;
  
  if (error?.code) {
    const errorMessages: Record<string, string> = {
      card_declined: 'Your card was declined. Please try another payment method.',
      insufficient_funds: 'Insufficient funds. Please try another card.',
      expired_card: 'Your card has expired. Please use a different card.',
      incorrect_cvc: 'Incorrect security code. Please check and try again.',
      processing_error: 'An error occurred while processing your card. Please try again.',
      rate_limit: 'Too many requests. Please try again in a moment.',
    };
    
    return errorMessages[error.code] || `Payment error: ${error.code}`;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export default {
  formatCurrency,
  dollarsToCents,
  centsToDollars,
  calculateCommission,
  getFeatureDisplayName,
  isTrialActive,
  isSubscriptionExpired,
  getDaysUntilExpiration,
  formatDate,
  formatRelativeTime,
  validatePaymentAmount,
  getSubscriptionStatusColor,
  parseStripeError,
};
