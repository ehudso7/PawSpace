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
  subscription_id?: string;
}

export interface BookingPaymentData {
  amount: number;
  providerId: string;
  providerName: string;
  bookingId: string;
}

export interface PaymentResult {
  paymentIntent: any;
  success: boolean;
}

export interface StripeError {
  code: string;
  message: string;
  type: string;
}

export type PremiumFeature = 
  | 'create_transformation'
  | 'unlimited_transformations'
  | 'no_watermarks'
  | 'premium_stickers'
  | 'featured_listings'
  | 'advanced_analytics'
  | 'priority_support'
  | 'ad_free';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripe_price_id: string;
}

export interface PaymentSheetConfig {
  clientSecret: string;
  merchantDisplayName: string;
  customerId?: string;
  customerEphemeralKeySecret?: string;
}