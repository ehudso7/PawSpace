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
  customer_id?: string;
}

export interface BookingPaymentData {
  amount: number;
  providerId: string;
  providerName: string;
  bookingId: string;
  description?: string;
}

export interface PaymentResult {
  paymentIntent: any;
  success: boolean;
}

export interface ProviderOnboardingResult {
  accountId: string;
  onboardingUrl: string;
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

export interface User {
  id: string;
  email: string;
  stripe_customer_id?: string;
  stripe_account_id?: string;
  is_premium: boolean;
  subscription_expires_at?: string;
  trial_ends_at?: string;
}

export interface CreateSubscriptionRequest {
  price_id: string;
  user_id: string;
}

export interface CreateBookingPaymentRequest {
  amount: number;
  provider_stripe_account_id: string;
  application_fee_amount: number;
  booking_id: string;
  description?: string;
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: any;
  };
}