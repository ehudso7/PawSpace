/**
 * Payment and subscription type definitions
 */

export type PremiumFeature = 
  | 'create_transformation'
  | 'export_without_watermark'
  | 'premium_stickers'
  | 'featured_listing'
  | 'advanced_analytics'
  | 'priority_support'
  | 'ad_free';

export interface SubscriptionResult {
  subscriptionId: string;
}

export interface SubscriptionStatus {
  is_premium: boolean;
  plan: 'free' | 'premium';
  expires_at?: string;
  is_trial: boolean;
  trial_ends_at?: string;
  can_cancel: boolean;
  transformations_used?: number;
  transformations_limit?: number;
}

export interface BookingPaymentData {
  amount: number;
  providerId: string;
  providerName: string;
  bookingId: string;
}

export interface PaymentResult {
  paymentIntent: any;
}

export interface ProviderOnboardingResult {
  accountId: string;
  onboardingUrl: string;
}

export interface PaymentError {
  code: string;
  message: string;
  type: 'card_error' | 'validation_error' | 'api_error' | 'network_error';
}

export interface StripeConfig {
  publishableKey: string;
  merchantDisplayName: string;
}

export interface PremiumBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  isPremium: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  stripePriceId: string;
  features: string[];
  trialDays?: number;
}
